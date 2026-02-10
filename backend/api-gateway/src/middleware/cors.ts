import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';
import { env } from '../config/env';

export async function setupCors(app: FastifyInstance) {
  const origins = [];
  
  // Origins Flutter
  if (env.FLUTTER_APP_URL) origins.push(env.FLUTTER_APP_URL);
  if (env.FLUTTER_ANDROID_URL) origins.push(env.FLUTTER_ANDROID_URL);
  if (env.FLUTTER_IOS_URL) origins.push(env.FLUTTER_IOS_URL);
  
  // Ajouter les origins de CORS_ORIGIN
  if (env.CORS_ORIGIN) {
    origins.push(...env.CORS_ORIGIN.split(',').map(o => o.trim()));
  }
  
  // Origins par défaut pour dev
  if (env.NODE_ENV === 'development') {
    origins.push('http://localhost:8080', 'http://localhost:3000');
  }

  await app.register(cors, {
    origin: origins.length > 0 ? origins : true,
    credentials: env.CORS_CREDENTIALS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'X-User-Id',
      'X-User-Email',
      'X-User-Role',
    ],
    exposedHeaders: [
      'X-Total-Count',
      'X-Page',
      'X-Page-Size',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
    maxAge: 86400, // 24 heures
  });

  app.log.info(` CORS configured for origins: ${origins.join(', ')}`);
}