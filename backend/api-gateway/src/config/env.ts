import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  HOST: z.string().default('0.0.0.0'),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Services
  AUTH_SERVICE_URL: z.string().url(),
  BOOKING_SERVICE_URL: z.string().url(),
  ACCOMMODATION_SERVICE_URL: z.string().url(),
  RESTAURANT_SERVICE_URL: z.string().url(),
  TRANSPORT_SERVICE_URL: z.string().url(),
  PAYMENT_SERVICE_URL: z.string().url(),
  NOTIFICATION_SERVICE_URL: z.string().url(),
  SERVICE_PROVIDER_URL: z.string().url(),
  RESOURCE_CORE_URL: z.string().url(),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().transform(Number).default('0'),

  // CORS
  CORS_ORIGIN: z.string(),
  CORS_CREDENTIALS: z.string().transform(val => val === 'true').default('true'),

  // Rate Limiting
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  RATE_LIMIT_TIMEWINDOW: z.string().transform(Number).default('60000'),

  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_PRETTY: z.string().transform(val => val === 'true').default('false'),

  // Health Check
  HEALTH_CHECK_INTERVAL: z.string().transform(Number).default('30000'),

  // WebSocket
  WS_ENABLED: z.string().transform(val => val === 'true').default('true'),
  WS_PORT: z.string().transform(Number).default('3001'),
  WS_PATH: z.string().default('/ws'),
  
  // Flutter specific
  FLUTTER_APP_URL: z.string().default('http://localhost:8080'),
  FLUTTER_ANDROID_URL: z.string().optional(),
  FLUTTER_IOS_URL: z.string().optional(),
  
  // Prisma (si DB locale dans gateway)
  DATABASE_URL: z.string().optional(),
  
  // Cache
  CACHE_TTL: z.string().transform(Number).default('300'), // 5 minutes
  CACHE_ENABLED: z.string().transform(val => val === 'true').default('true'),
  
  // Circuit Breaker
  CIRCUIT_BREAKER_THRESHOLD: z.string().transform(Number).default('5'),
  CIRCUIT_BREAKER_TIMEOUT: z.string().transform(Number).default('30000'),
  
  // Retry
  MAX_RETRIES: z.string().transform(Number).default('3'),
  RETRY_DELAY: z.string().transform(Number).default('1000'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('  Invalid environment variables:', error);
    process.exit(1);
  }
}

export const env = validateEnv();
