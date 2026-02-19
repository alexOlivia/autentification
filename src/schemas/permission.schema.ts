import { z } from 'zod';

export const createPermissionSchema = z.object({
  categorie: z.enum([
    'GESTION_RESSOURCES', 'GESTION_RESERVATIONS', 'GESTION_PAIEMENTS',
    'GESTION_UTILISATEURS', 'ADMINISTRATION_SYSTEME', 'CONSULTATION', 'AUTRE',
  ]),
  ressource: z.string().min(1),
  action: z.string().min(1),
  description: z.string().optional(),
});

export const assignPermissionSchema = z.object({
  permissionId: z.string().uuid(),
});

export const roleParamSchema = z.object({
  role: z.enum(['CLIENT', 'COMMERCANT', 'ADMIN', 'SUPER_ADMIN']),
});

export const rolePermissionParamsSchema = z.object({
  role: z.enum(['CLIENT', 'COMMERCANT', 'ADMIN', 'SUPER_ADMIN']),
  permissionId: z.string().uuid(),
});

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;
export type AssignPermissionInput = z.infer<typeof assignPermissionSchema>;
export type RoleParam = z.infer<typeof roleParamSchema>;
export type RolePermissionParams = z.infer<typeof rolePermissionParamsSchema>;
