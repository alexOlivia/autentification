import Redis from 'ioredis';
import { env } from '../config/env';
import logger from './logger';

export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      db: env.REDIS_DB,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      logger.info('  Redis connected successfully');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, stringValue);
      } else {
        await this.redis.set(key, stringValue);
      }
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      logger.error('Cache delete pattern error:', error);
    }
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const data = await this.redis.hget(key, field);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache hget error:', error);
      return null;
    }
  }

  async hset(key: string, field: string, value: unknown): Promise<void> {
    try {
      await this.redis.hset(key, field, JSON.stringify(value));
    } catch (error) {
      logger.error('Cache hset error:', error);
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    try {
      await this.redis.expire(key, seconds);
    } catch (error) {
      logger.error('Cache expire error:', error);
    }
  }

  async increment(key: string): Promise<number> {
    try {
      return await this.redis.incr(key);
    } catch (error) {
      logger.error('Cache increment error:', error);
      return 0;
    }
  }

  async decrement(key: string): Promise<number> {
    try {
      return await this.redis.decr(key);
    } catch (error) {
      logger.error('Cache decrement error:', error);
      return 0;
    }
  }

  // Rate limiting utilities
  async checkRateLimit(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<{
    allowed: boolean;
    remaining: number;
    reset: number;
  }> {
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;
    
    try {
      // Clean old entries
      await this.redis.zremrangebyscore(key, 0, windowStart);
      
      // Count recent requests
      const count = await this.redis.zcard(key);
      
      if (count >= limit) {
        const oldest = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
        const reset = oldest[1] ? parseInt(oldest[1]) + windowSeconds * 1000 : now + windowSeconds * 1000;
        
        return {
          allowed: false,
          remaining: 0,
          reset: Math.ceil(reset / 1000),
        };
      }
      
      // Add current request
      await this.redis.zadd(key, now, `${now}:${Math.random()}`);
      await this.redis.expire(key, windowSeconds);
      
      return {
        allowed: true,
        remaining: limit - count - 1,
        reset: Math.ceil((now + windowSeconds * 1000) / 1000),
      };
    } catch (error) {
      logger.error('Rate limit check error:', error);
      // En cas d'erreur Redis, autoriser la requête
      return {
        allowed: true,
        remaining: limit,
        reset: Math.ceil((now + windowSeconds * 1000) / 1000),
      };
    }
  }

  async close(): Promise<void> {
    await this.redis.quit();
  }
}

// Singleton instance
export const cache = new CacheService();