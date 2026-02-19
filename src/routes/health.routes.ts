import type { FastifyInstance } from 'fastify';
import { prisma } from '../config/database.js';
import { redis } from '../config/redis.js';

export default async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  fastify.get('/health/ready', async (_request, reply) => {
    const checks: Record<string, string> = {};

    try {
      await prisma.$queryRaw`SELECT 1`;
      checks['database'] = 'ok';
    } catch {
      checks['database'] = 'error';
    }

    try {
      await redis.ping();
      checks['redis'] = 'ok';
    } catch {
      checks['redis'] = 'error';
    }

    const allOk = Object.values(checks).every((v) => v === 'ok');
    return reply.status(allOk ? 200 : 503).send({
      status: allOk ? 'ready' : 'not_ready',
      checks,
      timestamp: new Date().toISOString(),
    });
  });
}
