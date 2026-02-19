import type { FastifyInstance } from 'fastify';
import { validateBody } from '../middlewares/validate.js';
import { forgotPasswordSchema, resetPasswordSchema } from '../schemas/password.schema.js';
import type { ForgotPasswordInput, ResetPasswordInput } from '../schemas/password.schema.js';
import * as passwordService from '../services/password.service.js';
import { success } from '../utils/api-response.js';

export default async function passwordRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /forgot-password
  fastify.post<{ Body: ForgotPasswordInput }>(
    '/forgot-password',
    {
      preHandler: [validateBody(forgotPasswordSchema)],
      config: { rateLimit: { max: 3, timeWindow: '15 minutes' } },
    },
    async (request, reply) => {
      const result = await passwordService.forgotPassword(request.body.identifiant);
      return reply.send(success(result));
    },
  );

  // POST /reset-password
  fastify.post<{ Body: ResetPasswordInput }>(
    '/reset-password',
    {
      preHandler: [validateBody(resetPasswordSchema)],
      config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
    },
    async (request, reply) => {
      await passwordService.resetPassword(
        request.body.utilisateurId,
        request.body.code,
        request.body.nouveauMotDePasse,
      );
      return reply.send(success({ message: 'Mot de passe réinitialisé avec succès' }));
    },
  );
}
