import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { sign, verify } from '../lib/jwt';
import { User } from '../repositories/user.repository'; // Assuming you have a User repository

const authSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

export const authRoutes = (app: FastifyInstance) => {
  app.post('/auth/login', async (request, reply) => {
    const { username, password } = authSchema.parse(request.body);

    const user = await User.findByUsername(username);
    if (!user || !(await user.verifyPassword(password))) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const token = sign({ id: user.id });
    return reply.send({ token });
  });

  app.post('/auth/register', async (request, reply) => {
    const { username, password } = authSchema.parse(request.body);

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return reply.status(400).send({ message: 'User already exists' });
    }

    const newUser = await User.create({ username, password });
    const token = sign({ id: newUser.id });
    return reply.status(201).send({ token });
  });

  app.get('/auth/verify', async (request, reply) => {
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      return reply.status(401).send({ message: 'Token required' });
    }

    try {
      const decoded = verify(token);
      return reply.send({ valid: true, userId: decoded.id });
    } catch (error) {
      return reply.status(401).send({ message: 'Invalid token' });
    }
  });
};