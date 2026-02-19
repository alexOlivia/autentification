import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';
import { env } from '../config/env.js';
import { redis } from '../config/redis.js';

export default fp(async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_TIME_WINDOW,
    redis,
    keyGenerator: (request) => request.ip,
    errorResponseBuilder: () => ({
      success: false,
      error: {
        code: 'TROP_DE_REQUETES',
        message: 'Trop de requêtes, veuillez réessayer plus tard',
      },
    }),
  });
});
