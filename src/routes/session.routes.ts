import type { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/authenticate.js';
import { validateParams } from '../middlewares/validate.js';
import { revokeSessionParamsSchema } from '../schemas/session.schema.js';
import type { RevokeSessionParams } from '../schemas/session.schema.js';
import * as sessionService from '../services/session.service.js';
import * as tokenService from './../../src/services/token.service.js';
import { success } from '../utils/api-response.js';

export default async function sessionRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /sessions
  fastify.get(
    '/sessions',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const sessions = await sessionService.getUserActiveSessions(request.utilisateur!.id);
      return reply.send(success(sessions));
    },
  );

  // DELETE /sessions/:id
  fastify.delete<{ Params: RevokeSessionParams }>(
    '/sessions/:id',
    { preHandler: [authenticate, validateParams(revokeSessionParamsSchema)] },
    async (request, reply) => {
      await sessionService.revokeSession(request.params.id, request.utilisateur!.id);
      return reply.send(success({ message: 'Session révoquée' }));
    },
  );

  // DELETE /sessions (toutes)
  fastify.delete(
    '/sessions',
    { preHandler: [authenticate] },
    async (request, reply) => {
      await tokenService.revokeAllUserTokens(request.utilisateur!.id);
      await sessionService.revokeAllUserSessions(request.utilisateur!.id);
      return reply.send(success({ message: 'Toutes les sessions ont été révoquées' }));
    },
  );
}
