import type { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validate.js';
import { updateProfileSchema, changePasswordSchema, adminUpdateUserSchema } from '../schemas/user.schema.js';
import { idParamSchema, paginationQuerySchema } from '../schemas/common.schema.js';
import type { UpdateProfileInput, ChangePasswordInput, AdminUpdateUserInput } from '../schemas/user.schema.js';
import type { IdParam, PaginationQuery } from '../schemas/common.schema.js';
import * as userService from '../services/user.service.js';
import { success, paginated } from '../utils/api-response.js';

export default async function userRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /me
  fastify.get(
    '/me',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const user = await userService.getUserById(request.utilisateur!.id);
      return reply.send(success(user));
    },
  );

  // PATCH /me
  fastify.patch<{ Body: UpdateProfileInput }>(
    '/me',
    { preHandler: [authenticate, validateBody(updateProfileSchema)] },
    async (request, reply) => {
      const user = await userService.updateProfile(request.utilisateur!.id, request.body);
      return reply.send(success(user));
    },
  );

  // PATCH /me/password
  fastify.patch<{ Body: ChangePasswordInput }>(
    '/me/password',
    { preHandler: [authenticate, validateBody(changePasswordSchema)] },
    async (request, reply) => {
      await userService.changePassword(
        request.utilisateur!.id,
        request.body.ancienMotDePasse,
        request.body.nouveauMotDePasse,
      );
      return reply.send(success({ message: 'Mot de passe modifié. Veuillez vous reconnecter.' }));
    },
  );

  // DELETE /me
  fastify.delete(
    '/me',
    { preHandler: [authenticate] },
    async (request, reply) => {
      await userService.softDeleteUser(request.utilisateur!.id);
      return reply.send(success({ message: 'Compte supprimé' }));
    },
  );

  // GET /users (admin)
  fastify.get<{ Querystring: PaginationQuery }>(
    '/users',
    { preHandler: [authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateQuery(paginationQuerySchema)] },
    async (request, reply) => {
      const result = await userService.listUsers({
        page: request.query.page,
        limit: request.query.limit,
      });
      return reply.send(paginated(result.data, result.meta));
    },
  );

  // GET /users/:id (admin)
  fastify.get<{ Params: IdParam }>(
    '/users/:id',
    { preHandler: [authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateParams(idParamSchema)] },
    async (request, reply) => {
      const user = await userService.getUserById(request.params.id);
      return reply.send(success(user));
    },
  );

  // PATCH /users/:id (admin)
  fastify.patch<{ Params: IdParam; Body: AdminUpdateUserInput }>(
    '/users/:id',
    {
      preHandler: [
        authenticate,
        authorize('ADMIN', 'SUPER_ADMIN'),
        validateParams(idParamSchema),
        validateBody(adminUpdateUserSchema),
      ],
    },
    async (request, reply) => {
      const user = await userService.adminUpdateUser(request.params.id, request.body);
      return reply.send(success(user));
    },
  );
}
