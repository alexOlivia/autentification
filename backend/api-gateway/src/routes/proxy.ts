import { FastifyInstance } from 'fastify';
import proxy from '@fastify/http-proxy';
import { SERVICES } from '../config/services';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { UserRole } from '../middleware/auth';

// Routes protégées par rôle
const ROLE_PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/api/admin': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/api/commercant': [UserRole.COMMERCANT, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/api/client': [UserRole.CLIENT],
};

export async function setupProxies(app: FastifyInstance) {
  for (const service of Object.values(SERVICES)) {
    app.log.info(`Configuration du proxy: ${service.prefix} → ${service.url}`);

    await app.register(proxy, {
      upstream: service.url,
      prefix: service.prefix,
      rewritePrefix: service.prefix,
      http2: false,

      // Vérification des rôles avant proxy
      preHandler: async (request, _reply) => {
        // Vérifier si la route nécessite un rôle spécifique
        for (const [route, allowedRoles] of Object.entries(ROLE_PROTECTED_ROUTES)) {
          if (request.url.startsWith(route)) {
            if (!request.user) {
              throw new UnauthorizedError('Authentification requise');
            }
            
            if (!allowedRoles.includes(request.user.role)) {
              throw new ForbiddenError(
                `Route réservée aux rôles: ${allowedRoles.join(', ')}`
              );
            }
            break;
          }
        }
      },

      // Réécriture des headers
      replyOptions: {
        rewriteRequestHeaders: (originalReq, headers) => {
          const newHeaders = { ...headers };

          // Injecter les infos utilisateur
          if (originalReq.user) {
            newHeaders['x-user-id'] = originalReq.user.userId;
            newHeaders['x-user-email'] = originalReq.user.email;
            newHeaders['x-user-role'] = originalReq.user.role;
            
            if (originalReq.user.permissions?.length > 0) {
              newHeaders['x-user-permissions'] = originalReq.user.permissions.join(',');
            }
          }

          // Ajouter des métadonnées de tracing
          newHeaders['x-gateway-request-id'] = originalReq.id;
          newHeaders['x-gateway-timestamp'] = Date.now().toString();

          return newHeaders;
        },
      },
    });

    // Hook pour logger les erreurs des microservices (après l'enregistrement du proxy)
    app.addHook('onResponse', async (request, reply) => {
      if (reply.statusCode >= 400 && request.url.startsWith(service.prefix)) {
        app.log.error({
          msg: 'Erreur microservice',
          service: service.name,
          url: request.url,
          statusCode: reply.statusCode,
          userId: request.user?.userId,
        });
      }
    });

    app.log.info(`✅ Proxy configuré: ${service.prefix} → ${service.url}`);
  }
}