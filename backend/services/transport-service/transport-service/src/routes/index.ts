import { FastifyInstance } from 'fastify';
import vehiculeRoutes from './vehicule.routes';
import trajetRoutes from './trajet.routes';
import authRoutes from './auth.routes';

export default async function routes(fastify: FastifyInstance) {
    fastify.register(vehiculeRoutes);
    fastify.register(trajetRoutes);
    fastify.register(authRoutes);
}