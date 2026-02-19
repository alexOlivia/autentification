import { Redis } from 'ioredis';
import { env } from './env.js';

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  db: env.REDIS_DB,
  maxRetriesPerRequest: 3,
  connectTimeout: 10000,
  retryStrategy(times: number) {
    if (times > 10) return null;
    return Math.min(times * 200, 5000);
  },
});

redis.on('error', (err: Error) => {
  console.error('Redis connection error:', err.message);
});

export async function closeRedis(): Promise<void> {
  await redis.quit();
}
