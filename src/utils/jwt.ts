import { createHmac, timingSafeEqual } from 'node:crypto';
import { jwtConfig, tokenExpirySeconds } from '../config/jwt.js';
import type { JwtPayload } from '../types/auth.js';
import { AuthenticationError } from './errors.js';

function base64UrlEncode(data: string): string {
  return Buffer.from(data).toString('base64url');
}

function base64UrlDecode(data: string): string {
  return Buffer.from(data, 'base64url').toString('utf-8');
}

function sign(payload: object, secret: string, expiresInSeconds: number): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac('sha256', secret).update(data).digest('base64url');

  return `${data}.${signature}`;
}

function verify<T>(token: string, secret: string): T & { iat: number; exp: number } {
  const parts = token.split('.');
  if (parts.length !== 3) throw new AuthenticationError('TOKEN_INVALIDE', 'Token invalide');

  const [encodedHeader, encodedPayload, signature] = parts as [string, string, string];
  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = createHmac('sha256', secret).update(data).digest('base64url');

  const sigBuffer = Buffer.from(signature, 'base64url');
  const expectedBuffer = Buffer.from(expectedSignature, 'base64url');

  if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
    throw new AuthenticationError('TOKEN_INVALIDE', 'Signature invalide');
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as T & { iat: number; exp: number };
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new AuthenticationError('TOKEN_EXPIRE', 'Token expiré');
  }

  return payload;
}

export function signAccessToken(payload: JwtPayload): string {
  return sign(payload, jwtConfig.accessSecret, tokenExpirySeconds.ACCESS);
}

export function signRefreshToken(payload: JwtPayload): string {
  return sign(payload, jwtConfig.refreshSecret, tokenExpirySeconds.REFRESH);
}

export function verifyAccessToken(token: string): JwtPayload & { iat: number; exp: number } {
  return verify<JwtPayload>(token, jwtConfig.accessSecret);
}

export function verifyRefreshToken(token: string): JwtPayload & { iat: number; exp: number } {
  return verify<JwtPayload>(token, jwtConfig.refreshSecret);
}

export function getTokenRemainingSeconds(token: string): number {
  const parts = token.split('.');
  if (parts.length !== 3) return 0;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1]!)) as { exp: number };
    return Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
  } catch {
    return 0;
  }
}
