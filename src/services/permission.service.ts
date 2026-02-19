import { prisma } from '../config/database.js';
import type { CategoriePermission, RoleUtilisateur } from '@prisma/client';
import { NotFoundError, ConflictError } from '../utils/errors.js';

interface CreatePermissionInput {
  categorie: CategoriePermission;
  ressource: string;
  action: string;
  description?: string;
}

export async function createPermission(data: CreatePermissionInput) {
  const existing = await prisma.permission.findUnique({
    where: { ressource_action: { ressource: data.ressource, action: data.action } },
  });
  if (existing) {
    throw new ConflictError('Cette permission existe déjà');
  }
  return prisma.permission.create({ data });
}

export async function listPermissions(categorie?: CategoriePermission) {
  return prisma.permission.findMany({
    where: categorie ? { categorie } : undefined,
    orderBy: [{ categorie: 'asc' }, { ressource: 'asc' }, { action: 'asc' }],
  });
}

export async function assignPermissionToRole(
  role: RoleUtilisateur,
  permissionId: string,
): Promise<void> {
  const permission = await prisma.permission.findUnique({ where: { id: permissionId } });
  if (!permission) throw new NotFoundError('Permission');

  const existing = await prisma.rolePermission.findUnique({
    where: { role_permissionId: { role, permissionId } },
  });
  if (existing) throw new ConflictError('Cette permission est déjà assignée à ce rôle');

  await prisma.rolePermission.create({
    data: { role, permissionId },
  });
}

export async function removePermissionFromRole(
  role: RoleUtilisateur,
  permissionId: string,
): Promise<void> {
  const record = await prisma.rolePermission.findUnique({
    where: { role_permissionId: { role, permissionId } },
  });
  if (!record) throw new NotFoundError('Association rôle-permission');

  await prisma.rolePermission.delete({
    where: { id: record.id },
  });
}

export async function getRolePermissions(role: RoleUtilisateur) {
  const records = await prisma.rolePermission.findMany({
    where: { role },
    include: { permission: true },
    orderBy: { permission: { categorie: 'asc' } },
  });
  return records.map((r) => r.permission);
}

export async function hasPermission(
  role: RoleUtilisateur,
  ressource: string,
  action: string,
): Promise<boolean> {
  if (role === 'SUPER_ADMIN') return true;

  const count = await prisma.rolePermission.count({
    where: {
      role,
      permission: { ressource, action },
    },
  });
  return count > 0;
}
