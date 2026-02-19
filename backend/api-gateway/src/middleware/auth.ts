import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTService } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { PUBLIC_ROUTES } from '../config/services';

// Enum des rôles du système (cohérent avec le backend)
export enum UserRole {
  CLIENT = 'CLIENT',
  COMMERCANT = 'COMMERCANT',    // Ancien PROVIDER
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

// Interface pour le payload JWT
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

export async function authMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply
) {
  // Skip auth pour les routes publiques
  if (PUBLIC_ROUTES.some(route => request.url.startsWith(route))) {
    return;
  }

  // Récupérer le token
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token manquant');
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Vérifier et décoder le JWT
    const decoded = JWTService.verify(token) as JWTPayload;
    
    // Vérifier que le rôle est valide
    if (!Object.values(UserRole).includes(decoded.role)) {
      throw new UnauthorizedError('Rôle utilisateur invalide');
    }

    // Attacher les infos utilisateur à la requête
    request.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || [],
    };

    // Injecter dans les headers pour les microservices
    request.headers['x-user-id'] = decoded.userId;
    request.headers['x-user-email'] = decoded.email;
    request.headers['x-user-role'] = decoded.role;
    
    // Injecter les permissions si présentes
    if (decoded.permissions && decoded.permissions.length > 0) {
      request.headers['x-user-permissions'] = decoded.permissions.join(',');
    }

  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Token invalide ou expiré');
  }
}

// Vérification de rôles spécifiques
export function requireRole(allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    if (!request.user) {
      throw new UnauthorizedError('Utilisateur non authentifié');
    }

    if (!allowedRoles.includes(request.user.role)) {
      throw new ForbiddenError(
        `Accès réservé aux rôles: ${allowedRoles.join(', ')}`
      );
    }
  };
}

// Vérification de permissions
export function requirePermission(requiredPermission: string) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    if (!request.user) {
      throw new UnauthorizedError('Utilisateur non authentifié');
    }

    const hasPermission = request.user.permissions?.includes(requiredPermission);
    if (!hasPermission) {
      throw new ForbiddenError(
        `Permission requise: ${requiredPermission}`
      );
    }
  };
}

// Middleware pour routes admin uniquement
export const adminOnly = requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);

// Middleware pour routes commercant uniquement
export const commercantOnly = requireRole([UserRole.COMMERCANT]);

// Middleware pour routes client uniquement
export const clientOnly = requireRole([UserRole.CLIENT]);

// Extension du type FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
      role: UserRole;
      permissions: string[];
    };
  }
}