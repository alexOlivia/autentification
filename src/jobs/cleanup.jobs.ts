import cron from 'node-cron';
import * as cleanupService from '../services/cleanup.service.js';

export function startCleanupJobs(): void {
  // Nettoyage RGPD des tentatives de connexion - tous les jours à 2h00
  cron.schedule('0 2 * * *', async () => {
    try {
      const count = await cleanupService.cleanupLoginAttempts();
      if (count > 0) {
        console.log(`[RGPD] ${count} tentatives de connexion anciennes supprimées`);
      }
    } catch (err) {
      console.error('[RGPD] Erreur nettoyage tentatives:', err);
    }
  });

  // Nettoyage des tokens expirés - toutes les 6 heures
  cron.schedule('0 */6 * * *', async () => {
    try {
      const [tokens, codes] = await Promise.all([
        cleanupService.cleanupExpiredTokens(),
        cleanupService.cleanupExpiredCodes(),
      ]);
      if (tokens > 0 || codes > 0) {
        console.log(`[CLEANUP] ${tokens} tokens et ${codes} codes expirés supprimés`);
      }
    } catch (err) {
      console.error('[CLEANUP] Erreur nettoyage tokens:', err);
    }
  });

  console.log('Jobs de nettoyage programmés (RGPD: 2h00/jour, Tokens: /6h)');
}
