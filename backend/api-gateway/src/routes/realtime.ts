import { FastifyInstance } from 'fastify';
import { WebSocket } from 'ws';
import { JWTService, UserRole } from '../utils/jwt';

interface WebSocketClient {
  socket: WebSocket;
  userId?: string;
  userRole?: UserRole;
  permissions: string[];
  rooms: Set<string>;
  connectedAt: Date;
}

export async function realtimeRoutes(app: FastifyInstance) {
  const clients = new Map<string, WebSocketClient>();

  // Route WebSocket principale
  app.get('/ws', { websocket: true }, (connection, req) => {
    const clientId = req.id as string;
    const client: WebSocketClient = {
      socket: connection.socket,
      permissions: [],
      rooms: new Set(['global']),
      connectedAt: new Date(),
    };

    clients.set(clientId, client);

    // Authentification obligatoire pour WebSocket
    const token = (req.query as { token?: string })?.token;
    if (!token) {
      connection.socket.send(JSON.stringify({
        type: 'auth_required',
        message: 'Token JWT requis pour la connexion WebSocket',
      }));
      connection.socket.close();
      return;
    }

    try {
      const decoded = JWTService.verify(token);
      client.userId = decoded.userId;
      client.userRole = decoded.role;
      client.permissions = decoded.permissions || [];
      
      // Joindre les rooms par défaut selon le rôle
      client.rooms.add(`user:${decoded.userId}`);
      client.rooms.add(`role:${decoded.role}`);
      
      // Rooms spécifiques par rôle
      switch (decoded.role) {
        case UserRole.CLIENT:
          client.rooms.add('clients');
          break;
        case UserRole.COMMERCANT:
          client.rooms.add('commercants');
          client.rooms.add('providers');
          break;
        case UserRole.ADMIN:
        case UserRole.SUPER_ADMIN:
          client.rooms.add('admins');
          client.rooms.add('monitoring');
          break;
      }

      connection.socket.send(JSON.stringify({
        type: 'auth_success',
        userId: decoded.userId,
        role: decoded.role,
        permissions: client.permissions,
        defaultRooms: Array.from(client.rooms),
      }));
      
      app.log.info(`WebSocket ${clientId}: ${decoded.role} ${decoded.userId} connecté`);
      
    } catch (error) {
      connection.socket.send(JSON.stringify({
        type: 'auth_error',
        message: 'Token invalide ou expiré',
      }));
      connection.socket.close();
      return;
    }

    // Gestion des messages
    connection.socket.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'join_room':
            // Vérifier les permissions pour certaines rooms
            if (data.room?.startsWith('admin:') && client.userRole !== UserRole.ADMIN && client.userRole !== UserRole.SUPER_ADMIN) {
              connection.socket.send(JSON.stringify({
                type: 'permission_denied',
                room: data.room,
                reason: 'Admin role required',
              }));
              return;
            }
            
            if (data.room) {
              client.rooms.add(data.room);
              connection.socket.send(JSON.stringify({
                type: 'room_joined',
                room: data.room,
                timestamp: new Date().toISOString(),
              }));
            }
            break;
            
          case 'leave_room':
            if (data.room) {
              client.rooms.delete(data.room);
            }
            break;
            
          case 'list_rooms':
            connection.socket.send(JSON.stringify({
              type: 'room_list',
              rooms: Array.from(client.rooms),
              timestamp: new Date().toISOString(),
            }));
            break;
        }
      } catch (error) {
        // Gestion des erreurs
      }
    });

    // Nettoyage
    connection.socket.on('close', () => {
      clients.delete(clientId);
    });

    // Message de bienvenue
    connection.socket.send(JSON.stringify({
      type: 'connected',
      clientId,
      role: client.userRole,
      timestamp: new Date().toISOString(),
    }));
  });

  // Helpers pour émettre selon le rôle
  app.decorate('emitToRole', (role: UserRole, event: string, data: unknown) => {
    let sent = 0;
    clients.forEach((client) => {
      if (client.userRole === role && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(JSON.stringify({ type: event, data, timestamp: new Date().toISOString() }));
        sent++;
      }
    });
    return sent;
  });

  app.decorate('emitToUser', (userId: string, event: string, data: unknown) => {
    let sent = 0;
    clients.forEach((client) => {
      if (client.userId === userId && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(JSON.stringify({ type: event, data, timestamp: new Date().toISOString() }));
        sent++;
      }
    });
    return sent;
  });

  app.decorate('emitToRoom', (room: string, event: string, data: unknown) => {
    let sent = 0;
    clients.forEach((client) => {
      if (client.rooms.has(room) && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(JSON.stringify({ type: event, data, timestamp: new Date().toISOString() }));
        sent++;
      }
    });
    return sent;
  });

  app.decorate('broadcastToAll', (event: string, data: unknown, excludeUserId?: string) => {
    let sent = 0;
    clients.forEach((client) => {
      if (
        client.socket.readyState === WebSocket.OPEN &&
        (!excludeUserId || client.userId !== excludeUserId)
      ) {
        client.socket.send(JSON.stringify({ type: event, data, timestamp: new Date().toISOString() }));
        sent++;
      }
    });
    return sent;
  });

  // Routes HTTP pour gérer les émissions côté serveur
  app.post('/api/ws/emit-to-role', async (request, reply) => {
    const { role, event, data } = request.body as { role: UserRole; event: string; data: unknown };
    const sent = app.emitToRole(role, event, data);
    return reply.send({ success: true, sent, role, event });
  });

  app.post('/api/ws/emit-to-user', async (request, reply) => {
    const { userId, event, data } = request.body as { userId: string; event: string; data: unknown };
    const sent = app.emitToUser(userId, event, data);
    return reply.send({ success: true, sent, userId, event });
  });

  app.get('/api/ws/stats', async (_request, reply) => {
    const stats = {
      totalClients: clients.size,
      byRole: {
        [UserRole.CLIENT]: 0,
        [UserRole.COMMERCANT]: 0,
        [UserRole.ADMIN]: 0,
        [UserRole.SUPER_ADMIN]: 0,
      },
      rooms: new Map<string, number>(),
    };

    clients.forEach((client) => {
      if (client.userRole) {
        stats.byRole[client.userRole]++;
      }
      client.rooms.forEach((room) => {
        stats.rooms.set(room, (stats.rooms.get(room) || 0) + 1);
      });
    });

    return reply.send({
      success: true,
      stats: {
        ...stats,
        rooms: Object.fromEntries(stats.rooms),
      },
    });
  });
}

// Déclaration des types pour les décorateurs Fastify
declare module 'fastify' {
  interface FastifyInstance {
    emitToRole: (role: UserRole, event: string, data: unknown) => number;
    emitToUser: (userId: string, event: string, data: unknown) => number;
    emitToRoom: (room: string, event: string, data: unknown) => number;
    broadcastToAll: (event: string, data: unknown, excludeUserId?: string) => number;
  }
}