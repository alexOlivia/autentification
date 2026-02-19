import type { FastifyInstance } from 'fastify';
import { validateBody } from '../middlewares/validate.js';
import { verifyCodeSchema, resendCodeSchema } from '../schemas/verification.schema.js';
import type { VerifyCodeInput, ResendCodeInput } from '../schemas/verification.schema.js';
import * as verificationService from '../services/verification.service.js';
import * as userService from '../services/user.service.js';
import { success } from '../utils/api-response.js';

export default async function verificationRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /verify
  fastify.post<{ Body: VerifyCodeInput }>(
    '/verify',
    {
      preHandler: [validateBody(verifyCodeSchema)],
      config: { rateLimit: { max: 5, timeWindow: '5 minutes' } },
    },
    async (request, reply) => {
      await verificationService.verifyCode(
        request.body.utilisateurId,
        request.body.code,
        request.body.typeVerification,
      );

      // Si c'est une vérification téléphone, activer le compte
      if (request.body.typeVerification === 'TELEPHONE') {
        await userService.activateUser(request.body.utilisateurId);
      }

      return reply.send(success({ message: 'Vérification réussie' }));
    },
  );

  // POST /resend-code
  fastify.post<{ Body: ResendCodeInput }>(
    '/resend-code',
    {
      preHandler: [validateBody(resendCodeSchema)],
      config: { rateLimit: { max: 3, timeWindow: '5 minutes' } },
    },
    async (request, reply) => {
      await verificationService.resendCode(
        request.body.utilisateurId,
        request.body.typeVerification,
      );
      return reply.send(success({ message: 'Nouveau code envoyé' }));
    },
  );
}
