import type { PrismaClient, RoleUtilisateur } from '@prisma/client';
import type { Redis } from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    redis: Redis;
  }
  interface FastifyRequest {
    utilisateur?: {
      id: string;
      role: RoleUtilisateur;
      email?: string;
      telephone: string;
    };
    deviceInfo?: {
      appareil: string;
      navigateur: string;
      systemeExploitation: string;
    };
  }
}
