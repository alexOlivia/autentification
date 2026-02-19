import type { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import {
  createPermissionSchema,
  assignPermissionSchema,
  roleParamSchema,
  rolePermissionParamsSchema,
} from '../schemas/permission.schema.js';
import type {
  CreatePermissionInput,
  AssignPermissionInput,
  RoleParam,
  RolePermissionParams,
} from '../schemas/permission.schema.js';
import * as permissionService from '../services/permission.service.js';
import { success } from '../utils/api-response.js';

export default async function permissionRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /permissions
  fastify.get(
    '/permissions',
    { preHandler: [authenticate, authorize('SUPER_ADMIN')] },
    async (_request, reply) => {
      const permissions = await permissionService.listPermissions();
      return reply.send(success(permissions));
    },
  );

  // POST /permissions
  fastify.post<{ Body: CreatePermissionInput }>(
    '/permissions',
    {
      preHandler: [
        authenticate,
        authorize('SUPER_ADMIN'),
        validateBody(createPermissionSchema),
      ],
    },
    async (request, reply) => {
      const permission = await permissionService.createPermission(request.body);
      return reply.status(201).send(success(permission));
    },
  );

  // GET /roles/:role/permissions
  fastify.get<{ Params: RoleParam }>(
    '/roles/:role/permissions',
    {
      preHandler: [
        authenticate,
        authorize('ADMIN', 'SUPER_ADMIN'),
        validateParams(roleParamSchema),
      ],
    },
    async (request, reply) => {
      const permissions = await permissionService.getRolePermissions(request.params.role);
      return reply.send(success(permissions));
    },
  );

  // POST /roles/:role/permissions
  fastify.post<{ Params: RoleParam; Body: AssignPermissionInput }>(
    '/roles/:role/permissions',
    {
      preHandler: [
        authenticate,
        authorize('SUPER_ADMIN'),
        validateParams(roleParamSchema),
        validateBody(assignPermissionSchema),
      ],
    },
    async (request, reply) => {
      await permissionService.assignPermissionToRole(
        request.params.role,
        request.body.permissionId,
      );
      return reply.status(201).send(success({ message: 'Permission assignée' }));
    },
  );

  // DELETE /roles/:role/permissions/:permissionId
  fastify.delete<{ Params: RolePermissionParams }>(
    '/roles/:role/permissions/:permissionId',
    {
      preHandler: [
        authenticate,
        authorize('SUPER_ADMIN'),
        validateParams(rolePermissionParamsSchema),
      ],
    },
    async (request, reply) => {
      await permissionService.removePermissionFromRole(
        request.params.role,
        request.params.permissionId,
      );
      return reply.send(success({ message: 'Permission retirée' }));
    },
  );
}
