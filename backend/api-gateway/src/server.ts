import { buildApp } from './app';
import { env } from './config/env';
import logger from './utils/logger';

async function start() {
  try {
    const app = await buildApp();

    // Start server
    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    logger.info(`
    ╔═══════════════════════════════════════════════════════════════════════╗
    ║                                                                       ║
    ║    API Gateway is running                                             ║
    ║                                                                       ║
    ║   Environment:  ${env.NODE_ENV.padEnd(42)}                            ║
    ║   Server:       http://${env.HOST}:${env.PORT}${' '.repeat(26)}       ║
    ║   Docs:         http://${env.HOST}:${env.PORT}/docs${' '.repeat(21)}  ║
    ║   Health:       http://${env.HOST}:${env.PORT}/health${' '.repeat(19)}║
    ║                                                                       ║
    ╚═══════════════════════════════════════════════════════════════════════╝
    `);

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach(signal => {
      process.on(signal, async () => {
        logger.info(`\n${signal} received, closing server gracefully...`);
        await app.close();
        logger.info('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
}

start();
