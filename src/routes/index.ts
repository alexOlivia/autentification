import type { FastifyInstance } from 'fastify';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import verificationRoutes from './verification.routes.js';
import passwordRoutes from './password.routes.js';
import userRoutes from './user.routes.js';
import sessionRoutes from './session.routes.js';
import permissionRoutes from './permission.routes.js';

export default async function routes(fastify: FastifyInstance): Promise<void> {
  // Health checks (pas de préfixe)
  await fastify.register(healthRoutes);

  // Routes API v1 sous /api/v1/auth
  await fastify.register(async function apiV1(app) {
    await app.register(authRoutes);
    await app.register(verificationRoutes);
    await app.register(passwordRoutes);
    await app.register(userRoutes);
    await app.register(sessionRoutes);
    await app.register(permissionRoutes);
  }, { prefix: '/api/v1/auth' });
}
