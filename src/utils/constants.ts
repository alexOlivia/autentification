export const VERIFICATION_CODE_LENGTH = 6;
export const MAX_VERIFICATION_ATTEMPTS = 3;

export const BRUTE_FORCE_THRESHOLD = 5;
export const BRUTE_FORCE_WINDOW_MINUTES = 15;

export const ADMIN_ALERT_THRESHOLD = 10;
export const ADMIN_ALERT_WINDOW_MINUTES = 60;

export const RGPD_LOGIN_ATTEMPTS_RETENTION_DAYS = 90;

export const REDIS_PREFIXES = {
  tokenBlacklist: 'bl:',
  session: 'sess:',
  bruteForce: 'brute:',
  adminAlert: 'alert:admin:',
} as const;
