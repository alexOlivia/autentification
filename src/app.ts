import Fastify from 'fastify';
import { loggerConfig } from './utils/logger.js';
import prismaPlugin from './plugins/prisma.plugin.js';
import redisPlugin from './plugins/redis.plugin.js';
import corsPlugin from './plugins/cors.plugin.js';
import helmetPlugin from './plugins/helmet.plugin.js';
import rateLimitPlugin from './plugins/rate-limit.plugin.js';
import { errorHandler } from './middlewares/error-handler.js';
import { requestContext } from './middlewares/request-context.js';
import routes from './routes/index.js';

export async function buildApp() {
  const app = Fastify({
    logger: loggerConfig,
    trustProxy: true,
  });

  // Plugins de sécurité
  await app.register(helmetPlugin);
  await app.register(corsPlugin);

  // Plugins d'infrastructure
  await app.register(prismaPlugin);
  await app.register(redisPlugin);
  await app.register(rateLimitPlugin);

  // Middleware global
  app.addHook('onRequest', requestContext);

  // Gestionnaire d'erreurs global
  app.setErrorHandler(errorHandler);

  // Routes
  await app.register(routes);

  return app;
}
