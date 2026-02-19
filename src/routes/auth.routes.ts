import type { FastifyInstance } from 'fastify';
import { validateBody } from '../middlewares/validate.js';
import { authenticate, extractToken } from '../middlewares/authenticate.js';
import { registerSchema, loginSchema, refreshTokenSchema, logoutSchema, verify2FASchema } from '../schemas/auth.schema.js';
import type { RegisterInput, LoginInput, RefreshTokenInput, LogoutInput, Verify2FAInput } from '../schemas/auth.schema.js';
import * as authService from '../services/auth.service.js';
import { success } from '../utils/api-response.js';

export default async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /register
  fastify.post<{ Body: RegisterInput }>(
    '/register',
    {
      preHandler: [validateBody(registerSchema)],
      config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
    },
    async (request, reply) => {
      const result = await authService.register(request.body);
      return reply.status(201).send(success(result));
    },
  );

  // POST /login
  fastify.post<{ Body: LoginInput }>(
    '/login',
    {
      preHandler: [validateBody(loginSchema)],
      config: { rateLimit: { max: 10, timeWindow: '15 minutes' } },
    },
    async (request, reply) => {
      const result = await authService.login(
        request.body.identifiant,
        request.body.motDePasse,
        request.ip,
        request.headers['user-agent'] ?? '',
      );
      return reply.send(success(result));
    },
  );

  // POST /verify-2fa
  fastify.post<{ Body: Verify2FAInput }>(
    '/verify-2fa',
    {
      preHandler: [validateBody(verify2FASchema)],
      config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
    },
    async (request, reply) => {
      const result = await authService.verify2FA(
        request.body.utilisateurId,
        request.body.code,
        request.ip,
        request.headers['user-agent'] ?? '',
      );
      return reply.send(success(result));
    },
  );

  // POST /refresh
  fastify.post<{ Body: RefreshTokenInput }>(
    '/refresh',
    { preHandler: [validateBody(refreshTokenSchema)] },
    async (request, reply) => {
      const result = await authService.refreshToken(
        request.body.refreshToken,
        request.ip,
        request.headers['user-agent'] ?? '',
      );
      return reply.send(success(result));
    },
  );

  // POST /logout
  fastify.post<{ Body: LogoutInput }>(
    '/logout',
    { preHandler: [authenticate, validateBody(logoutSchema)] },
    async (request, reply) => {
      const accessToken = extractToken(request);
      await authService.logout(
        request.utilisateur!.id,
        accessToken,
        request.body.refreshToken,
      );
      return reply.send(success({ message: 'Déconnexion réussie' }));
    },
  );
}
