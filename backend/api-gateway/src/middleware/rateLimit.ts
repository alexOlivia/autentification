import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';
import Redis from 'ioredis';
import { env } from '../config/env';

export async function setupRateLimit(app: FastifyInstance) {
  const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB,
  });

  await app.register(rateLimit, {
    global: true,
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_TIMEWINDOW,
    redis,
    nameSpace: 'api-gateway-rate-limit:',
    skipOnError: true, // Don't fail if Redis is down
    keyGenerator: (request) => {
      // Use user ID if authenticated, otherwise IP
      return request.user?.userId || request.ip;
    },
    errorResponseBuilder: (request, context) => {
      return {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests, please try again later`,
          statusCode: 429,
          timestamp: new Date().toISOString(),
          retryAfter: context.after,
        },
      };
    },
  });

  app.log.info('  Rate limiting configured with Redis');
}
