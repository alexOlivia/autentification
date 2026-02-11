import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { formatError, AppError } from '../utils/errors';

export function errorHandler(
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log the error
  request.log.error({
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
  });

  // Format and send error response
  const errorResponse = formatError(error, request.url);

  reply
    .status(errorResponse.error.statusCode)
    .send(errorResponse);
}
