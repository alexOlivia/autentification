import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    request.body = schema.parse(request.body);
  };
}

export function validateParams(schema: ZodSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    request.params = schema.parse(request.params);
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    request.query = schema.parse(request.query);
  };
}
