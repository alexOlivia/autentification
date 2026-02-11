import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { SERVICES } from '../config/services';

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: Record<string, 'up' | 'down'>;
}

export async function healthRoutes(app: FastifyInstance) {
  // Simple health check
  app.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Detailed health check with services status
  app.get('/health/detailed', async (request: FastifyRequest, reply: FastifyReply) => {
    const servicesStatus: Record<string, 'up' | 'down'> = {};

    // Check each service
    for (const [key, service] of Object.entries(SERVICES)) {
      try {
        const response = await fetch(`${service.url}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        servicesStatus[key] = response.ok ? 'up' : 'down';
      } catch (error) {
        servicesStatus[key] = 'down';
      }
    }

    // Determine overall status
    const allServicesUp = Object.values(servicesStatus).every(status => status === 'up');
    const someServicesDown = Object.values(servicesStatus).some(status => status === 'down');

    const status: HealthCheckResponse['status'] = allServicesUp
      ? 'healthy'
      : someServicesDown
      ? 'degraded'
      : 'unhealthy';

    const response: HealthCheckResponse = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: servicesStatus,
    };

    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

    return reply.status(statusCode).send(response);
  });

  // Readiness probe (for Kubernetes)
  app.get('/ready', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ ready: true });
  });

  // Liveness probe (for Kubernetes)
  app.get('/live', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ alive: true });
  });
}
