export class AppError extends Error {
  public details?: unknown;
  
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.details = details;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((Error as any).captureStackTrace) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', details?: unknown) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, 503, 'SERVICE_UNAVAILABLE');
  }
}

export class RoleForbiddenError extends AppError {
  constructor(requiredRole: string, userRole: string) {
    super(
      `Rôle insuffisant. Requis: ${requiredRole}, Actuel: ${userRole}`,
      403,
      'ROLE_FORBIDDEN',
      { requiredRole, userRole }
    );
  }
}

export class PermissionDeniedError extends AppError {
  constructor(permission: string) {
    super(
      `Permission manquante: ${permission}`,
      403,
      'PERMISSION_DENIED',
      { requiredPermission: permission }
    );
  }
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    statusCode: number;
    timestamp: string;
    path?: string;
    details?: unknown;
  };
}

export function formatError(
  error: Error | AppError,
  path?: string
): ErrorResponse {
  const isAppError = error instanceof AppError;

  return {
    error: {
      code: isAppError ? error.code || 'INTERNAL_ERROR' : 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
      statusCode: isAppError ? error.statusCode : 500,
      timestamp: new Date().toISOString(),
      path,
      details: isAppError ? error.details : undefined,
    },
  };
}
