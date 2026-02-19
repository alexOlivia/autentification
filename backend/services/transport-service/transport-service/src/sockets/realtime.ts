import { Server } from 'socket.io';
import { FastifyInstance } from 'fastify';

export const setupSockets = (server: FastifyInstance) => {
    const io = new Server(server.server);

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });

        // Example of handling a custom event
        socket.on('sendMessage', (message) => {
            console.log('Message received:', message);
            // Broadcast the message to all connected clients
            io.emit('receiveMessage', message);
        });
    });

    return io;
};