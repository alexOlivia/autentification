import { Server as SocketIOServer } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { verifyAccessToken } from '../utils/jwt.js';

let io: SocketIOServer | null = null;

export function initWebSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '/ws',
  });

  // Middleware d'authentification WebSocket
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      return next(new Error('Token d\'authentification requis'));
    }

    try {
      const payload = verifyAccessToken(token);
      socket.data.utilisateur = payload;
      next();
    } catch {
      next(new Error('Token invalide'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.utilisateur?.id;
    if (userId) {
      // Joindre la room de l'utilisateur pour recevoir ses notifications
      socket.join(`user:${userId}`);
    }

    socket.on('disconnect', () => {
      // Nettoyage automatique par Socket.io
    });
  });

  return io;
}

export function getWebSocketServer(): SocketIOServer | null {
  return io;
}
