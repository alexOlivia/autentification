import { FastifyReply, FastifyRequest } from 'fastify';

export const errorHandler = (error: Error, request: FastifyRequest, reply: FastifyReply) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    // Log the error (you can replace this with a proper logging mechanism)
    console.error(error);

    reply.status(statusCode).send({ error: message });
};