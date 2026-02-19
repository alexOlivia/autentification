import type { FastifyRequest } from 'fastify';
import { parseUserAgent } from '../utils/device-parser.js';

export async function requestContext(request: FastifyRequest): Promise<void> {
  const userAgent = request.headers['user-agent'];
  request.deviceInfo = parseUserAgent(userAgent);
}
