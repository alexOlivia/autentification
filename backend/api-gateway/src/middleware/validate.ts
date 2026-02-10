import { FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors';

// Schémas de validation communs
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Middleware de validation générique
export const validateRequest = (schema: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}) => {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    try {
      const validated: Record<string, unknown> = {};

      if (schema.body) {
        validated.body = schema.body.parse(request.body);
      }

      if (schema.query) {
        validated.query = schema.query.parse(request.query);
      }

      if (schema.params) {
        validated.params = schema.params.parse(request.params);
      }

      // Attach validated data to request
      request.validated = validated;
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        throw new BadRequestError('Validation Error', details);
      }
      throw error;
    }
  };
};

// Extension du type FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    validated?: {
      body?: unknown;
      query?: unknown;
      params?: unknown;
    };
  }
}