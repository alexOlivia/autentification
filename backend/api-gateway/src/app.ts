import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
// import swagger from '@fastify/swagger';
// import swaggerUi from '@fastify/swagger-ui';

import fastifyWebsocket from '@fastify/websocket';
import fastifyRedis from '@fastify/redis';
import { realtimeRoutes } from './routes/realtime';
// import { validateRequest } from './middleware/validate'; // Pour usage futur
import { cache } from './utils/cache';
import { ResponseFormatter } from './utils/responseFormatter';

import { env } from './config/env';
// import logger from './utils/logger'; // Utilisé via Fastify logger

import { setupCors } from './middleware/cors';
import { setupRateLimit } from './middleware/rateLimit';
import { authMiddleware } from './middleware/auth';
import { loggerMiddleware, logResponse } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

import { healthRoutes } from './routes/health';
import { setupProxies } from './routes/proxy';


export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport: env.NODE_ENV === 'development' 
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined
    },
    requestIdHeader: 'x-request-id',
    disableRequestLogging: env.NODE_ENV === 'production',
    trustProxy: true,
    bodyLimit: 1048576, // 1MB
    connectionTimeout: 30000,
  });

  // 1. Helmet (sécurité)
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    },
    crossOriginEmbedderPolicy: false
  });

  await app.register(sensible);

  // 2. Redis
  await app.register(fastifyRedis, {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB,
  });

  // 3. WebSocket
  await app.register(fastifyWebsocket, {
    options: {
      maxPayload: 1048576,
      clientTracking: true,
    }
  });

  // 4. CORS
  await setupCors(app);

  // 5. Rate Limiting
  await setupRateLimit(app);

  // 6. Swagger
  // ... configuration Swagger existante

  // 7. Middlewares globaux
  app.addHook('onRequest', loggerMiddleware);
  app.addHook('preValidation', (request, reply, done) => {
    // Validation basique pour les routes non-proxy
    if (!request.url.includes('/api/')) {
      // Appliquer validateRequest si nécessaire
    }
    done();
  });
  app.addHook('onRequest', authMiddleware);
  app.addHook('onResponse', logResponse);

  // 8. Formatter de réponse pour Flutter
  app.setReplySerializer((payload, statusCode) => {
    const data = payload as { error?: { code?: string; message?: string; details?: unknown } };
    
    if (statusCode >= 400) {
      return JSON.stringify(
        ResponseFormatter.error(
          data.error?.code || 'INTERNAL_ERROR',
          data.error?.message || 'An error occurred',
          undefined,
          data.error?.details
        )
      );
    }
    
    return JSON.stringify(
      ResponseFormatter.success(payload)
    );
  });

  // 9. Error handler
  app.setErrorHandler(errorHandler);

  // 10. Routes
  await app.register(healthRoutes);
  await app.register(realtimeRoutes); // ← Nouveau
  await setupProxies(app);

  // 11. Route racine
  app.get('/', async () => {
    return ResponseFormatter.success({
      name: 'Booking System API Gateway',
      version: '1.0.0',
      status: 'running',
      environment: env.NODE_ENV,
      features: {
        websocket: true,
        redis: true,
        rateLimiting: true,
        cors: true,
      },
      endpoints: {
        docs: '/docs',
        health: '/health',
        websocket: '/ws',
      },
    });
  });

  // 12. Injecter le service cache
  app.decorate('cache', cache);

  return app;
}

// Extension de Fastify
declare module 'fastify' {
  interface FastifyInstance {
    cache: typeof cache;
  }
}
