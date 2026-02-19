import { prisma } from '../config/database.js';
import { redis } from '../config/redis.js';
import type { TypeToken } from '@prisma/client';
import type { JwtPayload, TokenPair } from '../types/auth.js';
import { signAccessToken, signRefreshToken, getTokenRemainingSeconds } from '../utils/jwt.js';
import { REDIS_PREFIXES } from '../utils/constants.js';
import { tokenExpirySeconds } from '../config/jwt.js';

export function generateTokenPair(payload: JwtPayload): TokenPair {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

interface SaveTokenInput {
  utilisateurId: string;
  token: string;
  typeToken: TypeToken;
  dateExpiration: Date;
  adresseIP?: string;
  userAgent?: string;
}

export async function saveToken(data: SaveTokenInput) {
  return prisma.tokenAcces.create({ data });
}

export async function revokeToken(tokenId: string): Promise<void> {
  await prisma.tokenAcces.update({
    where: { id: tokenId },
    data: { estRevoque: true },
  });
}

export async function revokeAllUserTokens(utilisateurId: string): Promise<void> {
  const tokens = await prisma.tokenAcces.findMany({
    where: { utilisateurId, estRevoque: false },
    select: { id: true, token: true, dateExpiration: true },
  });

  await prisma.tokenAcces.updateMany({
    where: { utilisateurId, estRevoque: false },
    data: { estRevoque: true },
  });

  // Blacklister tous les tokens dans Redis
  const pipeline = redis.pipeline();
  for (const t of tokens) {
    const remaining = getTokenRemainingSeconds(t.token);
    if (remaining > 0) {
      pipeline.setex(`${REDIS_PREFIXES.tokenBlacklist}${t.token}`, remaining, '1');
    }
  }
  await pipeline.exec();
}

export async function blacklistToken(token: string, expiresInSeconds?: number): Promise<void> {
  const ttl = expiresInSeconds ?? getTokenRemainingSeconds(token);
  if (ttl > 0) {
    await redis.setex(`${REDIS_PREFIXES.tokenBlacklist}${token}`, ttl, '1');
  }
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const exists = await redis.exists(`${REDIS_PREFIXES.tokenBlacklist}${token}`);
  return exists === 1;
}

export async function findRefreshTokenRecord(token: string) {
  return prisma.tokenAcces.findFirst({
    where: { token, typeToken: 'REFRESH', estRevoque: false },
    include: { utilisateur: true },
  });
}

export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.tokenAcces.deleteMany({
    where: {
      OR: [
        { estRevoque: true, dateExpiration: { lt: new Date() } },
        { dateExpiration: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      ],
    },
  });
  return result.count;
}
