import { prisma } from '../config/database.js';
import type { RoleUtilisateur, StatutUtilisateur } from '@prisma/client';
import type { PaginationInput } from '../types/common.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { NotFoundError, AuthenticationError, ConflictError } from '../utils/errors.js';
import * as tokenService from './token.service.js';
import * as sessionService from './session.service.js';

const USER_SELECT = {
  id: true,
  email: true,
  telephone: true,
  prenom: true,
  nom: true,
  urlAvatar: true,
  dateNaissance: true,
  role: true,
  statut: true,
  emailVerifie: true,
  telephoneVerifie: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getUserById(id: string) {
  const user = await prisma.utilisateur.findUnique({
    where: { id },
    select: USER_SELECT,
  });
  if (!user) throw new NotFoundError('Utilisateur');
  return user;
}

interface UpdateProfileInput {
  prenom?: string;
  nom?: string;
  urlAvatar?: string;
  dateNaissance?: string;
  email?: string;
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  if (data.email) {
    const existing = await prisma.utilisateur.findFirst({
      where: { email: data.email, id: { not: userId } },
    });
    if (existing) throw new ConflictError('Cet email est déjà utilisé');
  }

  return prisma.utilisateur.update({
    where: { id: userId },
    data: {
      ...data,
      dateNaissance: data.dateNaissance ? new Date(data.dateNaissance) : undefined,
      emailVerifie: data.email ? false : undefined,
    },
    select: USER_SELECT,
  });
}

export async function changePassword(
  userId: string,
  ancienMotDePasse: string,
  nouveauMotDePasse: string,
): Promise<void> {
  const user = await prisma.utilisateur.findUnique({
    where: { id: userId },
    select: { motDePasse: true },
  });
  if (!user) throw new NotFoundError('Utilisateur');

  const valid = await comparePassword(ancienMotDePasse, user.motDePasse);
  if (!valid) {
    throw new AuthenticationError('MOT_DE_PASSE_INCORRECT', 'Ancien mot de passe incorrect');
  }

  const hash = await hashPassword(nouveauMotDePasse);
  await prisma.utilisateur.update({
    where: { id: userId },
    data: { motDePasse: hash },
  });

  // Révoquer tous les tokens et sessions
  await tokenService.revokeAllUserTokens(userId);
  await sessionService.revokeAllUserSessions(userId);
}

export async function softDeleteUser(userId: string): Promise<void> {
  await prisma.utilisateur.update({
    where: { id: userId },
    data: { statut: 'SUPPRIME', dateSuppression: new Date() },
  });
  await tokenService.revokeAllUserTokens(userId);
  await sessionService.revokeAllUserSessions(userId);
}

export async function activateUser(userId: string): Promise<void> {
  await prisma.utilisateur.update({
    where: { id: userId },
    data: { statut: 'ACTIF', telephoneVerifie: true },
  });
}

interface UserFilters {
  role?: RoleUtilisateur;
  statut?: StatutUtilisateur;
  search?: string;
}

export async function listUsers(pagination: PaginationInput, filters?: UserFilters) {
  const where: Record<string, unknown> = { statut: { not: 'SUPPRIME' as const } };

  if (filters?.role) where['role'] = filters.role;
  if (filters?.statut) where['statut'] = filters.statut;
  if (filters?.search) {
    where['OR'] = [
      { prenom: { contains: filters.search, mode: 'insensitive' } },
      { nom: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { telephone: { contains: filters.search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.utilisateur.findMany({
      where,
      select: USER_SELECT,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.utilisateur.count({ where }),
  ]);

  return {
    data,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
}

interface AdminUpdateInput {
  role?: RoleUtilisateur;
  statut?: StatutUtilisateur;
}

export async function adminUpdateUser(userId: string, data: AdminUpdateInput) {
  return prisma.utilisateur.update({
    where: { id: userId },
    data,
    select: USER_SELECT,
  });
}
