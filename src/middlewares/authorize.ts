import type { FastifyRequest, FastifyReply } from 'fastify';
import type { RoleUtilisateur } from '@prisma/client';
import { AuthorizationError, AuthenticationError } from '../utils/errors.js';

export function authorize(...roles: RoleUtilisateur[]) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.utilisateur) {
      throw new AuthenticationError('TOKEN_MANQUANT', 'Authentification requise');
    }
    if (!roles.includes(request.utilisateur.role)) {
      throw new AuthorizationError('Vous n\'avez pas les permissions nécessaires');
    }
  };
}
