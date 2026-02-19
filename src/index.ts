import { env } from './config/env.js';
import { buildApp } from './app.js';
import { startCleanupJobs } from './jobs/cleanup.jobs.js';
import { initWebSocket } from './config/websocket.js';

async function main() {
  const app = await buildApp();

  // Démarrer les jobs de nettoyage
  startCleanupJobs();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    console.log(`Serveur d'authentification démarré sur http://${env.HOST}:${env.PORT}`);

    // Initialiser Socket.io sur le serveur HTTP de Fastify
    const httpServer = app.server;
    const io = initWebSocket(httpServer);
    console.log(`WebSocket initialisé sur le path /ws`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Arrêt gracieux
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} reçu. Arrêt gracieux...`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

main();
