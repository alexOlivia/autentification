import { env } from './env';

export const redisConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  db: env.REDIS_DB,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: true,
  connectTimeout: 10000,
};

export const cacheConfig = {
  defaultTTL: 300, // 5 minutes
  enabled: process.env.NODE_ENV !== 'test',
};

export const rateLimitConfig = {
  max: env.RATE_LIMIT_MAX,
  timeWindow: env.RATE_LIMIT_TIMEWINDOW,
  skipOnError: true,
};