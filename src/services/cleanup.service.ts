import { prisma } from '../config/database.js';
import { RGPD_LOGIN_ATTEMPTS_RETENTION_DAYS } from '../utils/constants.js';

export async function cleanupLoginAttempts(): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RGPD_LOGIN_ATTEMPTS_RETENTION_DAYS);

  const result = await prisma.tentativeConnexion.deleteMany({
    where: { dateHeure: { lt: cutoffDate } },
  });
  return result.count;
}

export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.tokenAcces.deleteMany({
    where: {
      OR: [
        { estRevoque: true, dateExpiration: { lt: new Date() } },
        { dateExpiration: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      ],
    },
  });
  return result.count;
}

export async function cleanupExpiredCodes(): Promise<number> {
  const result = await prisma.codeVerification.deleteMany({
    where: {
      OR: [
        { estUtilise: true },
        { dateExpiration: { lt: new Date() } },
      ],
    },
  });
  return result.count;
}
