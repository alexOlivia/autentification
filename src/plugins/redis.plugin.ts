import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { redis, closeRedis } from '../config/redis.js';

export default fp(async function redisPlugin(fastify: FastifyInstance) {
  fastify.decorate('redis', redis);

  fastify.addHook('onClose', async () => {
    await closeRedis();
  });
});
