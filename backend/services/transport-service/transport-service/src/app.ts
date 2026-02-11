import fastify from 'fastify';
import { registerRoutes } from './routes/index';
import { connectToDatabase } from './lib/prisma';
import { connectToRedis } from './lib/redis';
import { setupSockets } from './server/sockets';
import { errorHandler } from './middlewares/error.middleware';

const app = fastify({ logger: true });

const startServer = async () => {
    try {
        await connectToDatabase();
        await connectToRedis();

        app.register(errorHandler);
        registerRoutes(app);
        setupSockets(app);

        const PORT = process.env.PORT || 3000;
        await app.listen(PORT, '0.0.0.0');
        app.log.info(`Server is running on http://localhost:${PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

startServer();