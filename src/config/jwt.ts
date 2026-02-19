import { env } from './env.js';

export const jwtConfig = {
  accessSecret: env.JWT_ACCESS_SECRET,
  refreshSecret: env.JWT_REFRESH_SECRET,
  accessExpiration: env.JWT_ACCESS_EXPIRATION,
  refreshExpiration: env.JWT_REFRESH_EXPIRATION,
} as const;

/** Durées d'expiration des codes de vérification en secondes */
export const verificationCodeExpiry = {
  SMS: 5 * 60,
  EMAIL: 15 * 60,
  RESET_PASSWORD: 60 * 60,
  DOUBLE_AUTHENTIFICATION: 5 * 60,
} as const;

/** Durées d'expiration des tokens en secondes (pour TTL Redis) */
export const tokenExpirySeconds = {
  ACCESS: 15 * 60,
  REFRESH: 7 * 24 * 60 * 60,
  RESET_PASSWORD: 60 * 60,
  EMAIL_VERIFICATION: 24 * 60 * 60,
} as const;
