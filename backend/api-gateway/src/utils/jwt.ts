import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

// Enum des rôles (cohérent avec auth.ts)
export enum UserRole {
  CLIENT = 'CLIENT',
  COMMERCANT = 'COMMERCANT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

export class JWTService {
  // Vérifier un token
  static verify(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
      
      // Validation supplémentaire du rôle
      if (!Object.values(UserRole).includes(decoded.role)) {
        throw new Error('Rôle utilisateur invalide');
      }
      
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expiré');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Token JWT invalide');
      }
      throw new Error('Token invalide');
    }
  }

  // Décoder sans vérifier (pour debug)
  static decode(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }

  // Créer un nouveau token
  static sign(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    // Validation du rôle avant signature
    if (!Object.values(UserRole).includes(payload.role)) {
      throw new Error(`Rôle invalide: ${payload.role}`);
    }

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as SignOptions);
  }

  // Rafraîchir un token (si nécessaire)
  static refresh(token: string): string {
    const decoded = this.verify(token);
    
    // Créer un nouveau payload sans iat/exp
    const cleanPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions,
    };
    
    return this.sign(cleanPayload);
  }

  // Vérifier un rôle spécifique
  static hasRole(token: string, requiredRole: UserRole): boolean {
    try {
      const decoded = this.verify(token);
      return decoded.role === requiredRole;
    } catch {
      return false;
    }
  }

  // Vérifier plusieurs rôles
  static hasAnyRole(token: string, roles: UserRole[]): boolean {
    try {
      const decoded = this.verify(token);
      return roles.includes(decoded.role);
    } catch {
      return false;
    }
  }

  // Vérifier une permission
  static hasPermission(token: string, permission: string): boolean {
    try {
      const decoded = this.verify(token);
      return decoded.permissions?.includes(permission) || false;
    } catch {
      return false;
    }
  }
}