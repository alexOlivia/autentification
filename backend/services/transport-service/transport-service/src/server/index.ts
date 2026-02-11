import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import { registerRoutes } from '../routes/index';
import { setupSockets } from './sockets';

const prisma = new PrismaClient();
const redisClient = createClient();

const server = fastify({ logger: true });

server.decorate('prisma', prisma);
server.decorate('redis', redisClient);

export const startServer = async (port: number): Promise<void> => {
    try {
        await redisClient.connect();
        await server.listen(port);
        registerRoutes(server);
        setupSockets(server);
        server.log.info(`Server listening on http://localhost:${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

export const stopServer = async (): Promise<void> => {
    await server.close();
    await redisClient.quit();
    await prisma.$disconnect();
};