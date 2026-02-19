import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),

  DATABASE_URL: z.string(),

  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().default(''),
  REDIS_DB: z.coerce.number().default(0),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),

  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),

  SMS_PROVIDER_URL: z.string().default(''),
  SMS_PROVIDER_API_KEY: z.string().default(''),
  SMS_SENDER_ID: z.string().default('AuthService'),

  SMTP_HOST: z.string().default(''),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z.string().default(''),

  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_TIME_WINDOW: z.coerce.number().default(60000),

  LOGIN_ATTEMPTS_RETENTION_DAYS: z.coerce.number().default(90),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Variables d\'environnement invalides:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return Object.freeze(result.data);
}

export const env = loadEnv();
