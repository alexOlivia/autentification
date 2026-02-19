import { prisma } from '../config/database.js';
import { redis } from '../config/redis.js';
import {
  BRUTE_FORCE_THRESHOLD,
  BRUTE_FORCE_WINDOW_MINUTES,
  ADMIN_ALERT_THRESHOLD,
  ADMIN_ALERT_WINDOW_MINUTES,
  REDIS_PREFIXES,
} from '../utils/constants.js';

interface RecordAttemptInput {
  email?: string;
  telephone?: string;
  adresseIP: string;
  reussi: boolean;
  motifEchec?: string;
  userAgent?: string;
}

export async function recordAttempt(data: RecordAttemptInput): Promise<void> {
  await prisma.tentativeConnexion.create({
    data: {
      email: data.email,
      telephone: data.telephone,
      adresseIP: data.adresseIP,
      reussi: data.reussi,
      motifEchec: data.motifEchec,
      userAgent: data.userAgent,
    },
  });

  // Incrémenter le compteur Redis pour la détection brute force
  if (!data.reussi) {
    const identifier = data.email ?? data.telephone ?? data.adresseIP;
    const key = `${REDIS_PREFIXES.bruteForce}${identifier}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, BRUTE_FORCE_WINDOW_MINUTES * 60);
    }
  }
}

export async function isBlocked(
  identifier: string,
  adresseIP: string,
): Promise<{ blocked: boolean; remainingSeconds?: number }> {
  // Vérifier le compteur par identifiant
  const identKey = `${REDIS_PREFIXES.bruteForce}${identifier}`;
  const ipKey = `${REDIS_PREFIXES.bruteForce}${adresseIP}`;

  const [identCount, ipCount] = await Promise.all([
    redis.get(identKey),
    redis.get(ipKey),
  ]);

  const count = Math.max(Number(identCount ?? 0), Number(ipCount ?? 0));

  if (count >= BRUTE_FORCE_THRESHOLD) {
    const ttl = await redis.ttl(identKey);
    return { blocked: true, remainingSeconds: ttl > 0 ? ttl : BRUTE_FORCE_WINDOW_MINUTES * 60 };
  }

  // Vérifier le seuil d'alerte admin (>10 en 1h)
  if (count >= ADMIN_ALERT_THRESHOLD) {
    const alertKey = `${REDIS_PREFIXES.adminAlert}${identifier}`;
    const alreadyAlerted = await redis.exists(alertKey);
    if (!alreadyAlerted) {
      await redis.setex(alertKey, ADMIN_ALERT_WINDOW_MINUTES * 60, '1');
      console.warn(`[ALERTE SECURITE] Trop de tentatives échouées pour: ${identifier}`);
    }
  }

  return { blocked: false };
}

export async function resetAttempts(identifier: string): Promise<void> {
  await redis.del(`${REDIS_PREFIXES.bruteForce}${identifier}`);
}
