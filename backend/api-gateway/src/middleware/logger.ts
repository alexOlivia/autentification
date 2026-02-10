import { FastifyRequest, FastifyReply } from 'fastify';

// Extend FastifyRequest to include startTime
declare module 'fastify' {
  interface FastifyRequest {
    startTime?: number;
  }
}

export async function loggerMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply
) {
  // Store start time on request object
  request.startTime = Date.now();
}

export function logResponse(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const duration = request.startTime ? Date.now() - request.startTime : 0;

  request.log.info({
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    duration: `${duration}ms`,
    userId: request.user?.userId,
    ip: request.ip,
    userAgent: request.headers['user-agent'],
  });
}
