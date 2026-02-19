import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { error as errorResponse } from '../utils/api-response.js';

export function errorHandler(
  err: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  request.log.error(err);

  if (err instanceof AppError) {
    void reply.status(err.statusCode).send(
      errorResponse(err.code, err.message, err.details),
    );
    return;
  }

  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      champ: e.path.join('.'),
      message: e.message,
    }));
    void reply.status(400).send(
      errorResponse('DONNEES_INVALIDES', 'Données de requête invalides', details),
    );
    return;
  }

  // Prisma unique constraint violation
  if ('code' in err && (err as { code: string }).code === 'P2002') {
    void reply.status(409).send(
      errorResponse('CONFLIT', 'Cette ressource existe déjà'),
    );
    return;
  }

  // Fastify validation error
  if ('validation' in err) {
    void reply.status(400).send(
      errorResponse('DONNEES_INVALIDES', err.message),
    );
    return;
  }

  void reply.status(500).send(
    errorResponse('ERREUR_INTERNE', 'Erreur interne du serveur'),
  );
}
