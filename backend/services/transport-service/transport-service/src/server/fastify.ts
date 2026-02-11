import fastify, { FastifyInstance } from 'fastify';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

const prisma = new PrismaClient();
const redisClient = createClient();

const buildFastify = (): FastifyInstance => {
    const app = fastify({ logger: true });

    // Register plugins
    app.register(cors);
    app.register(helmet);

    // Redis client connection
    redisClient.on('error', (err) => {
        app.log.error('Redis Client Error', err);
    });

    redisClient.connect().catch((err) => {
        app.log.error('Failed to connect to Redis', err);
    });

    // Socket.io setup
    const server: HttpServer = app.server;
    const io: Server = new Server(server);

    io.on('connection', (socket: Socket) => {
        app.log.info('New client connected');

        socket.on('disconnect', () => {
            app.log.info('Client disconnected');
        });
    });

    return app;
};

export { buildFastify, prisma, redisClient };