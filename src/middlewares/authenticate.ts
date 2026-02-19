import type { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken, getTokenRemainingSeconds } from '../utils/jwt.js';
import { AuthenticationError } from '../utils/errors.js';
import { REDIS_PREFIXES } from '../utils/constants.js';
import { redis } from '../config/redis.js';

export async function authenticate(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('TOKEN_MANQUANT', 'Token d\'authentification requis');
  }

  const token = authHeader.slice(7);

  // Vérifier si le token est dans la blacklist Redis
  const isBlacklisted = await redis.exists(`${REDIS_PREFIXES.tokenBlacklist}${token}`);
  if (isBlacklisted) {
    throw new AuthenticationError('TOKEN_REVOQUE', 'Token révoqué');
  }

  const payload = verifyAccessToken(token);

  request.utilisateur = {
    id: payload.id,
    role: payload.role,
    email: payload.email,
    telephone: payload.telephone,
  };
}

export function extractToken(request: FastifyRequest): string {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('TOKEN_MANQUANT', 'Token d\'authentification requis');
  }
  return authHeader.slice(7);
}
