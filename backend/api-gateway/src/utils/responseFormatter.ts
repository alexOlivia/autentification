import { FastifyRequest } from 'fastify';
import { UserRole } from './jwt';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    timestamp: string;
    version: string;
    requestId?: string;
    user?: {
      userId: string;
      role: UserRole;
    };
    pagination?: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export class ResponseFormatter {
  static success<T>(
    data: T,
    request?: FastifyRequest,
    options?: {
      message?: string;
      pagination?: {
        total: number;
        page: number;
        limit: number;
      };
      includeUser?: boolean;
    }
  ): ApiResponse<T> {
    const response: ApiResponse<T> = {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        requestId: request?.id as string,
      },
    };

    // Ajouter les infos utilisateur si demandé et disponibles
    if (options?.includeUser !== false && request?.user) {
      const user = request.user as { userId: string; role: UserRole };
      response.meta.user = {
        userId: user.userId,
        role: user.role,
      };
    }

    if (options?.message && typeof data === 'object' && data !== null) {
      response.data = { message: options.message, ...(data as object) } as T;
    }

    if (options?.pagination) {
      const { total, page, limit } = options.pagination;
      response.meta.pagination = {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    }

    return response;
  }

  static error(
    code: string,
    message: string,
    request?: FastifyRequest,
    details?: unknown,
    includeUser: boolean = false
  ): ApiResponse {
    const response: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        requestId: request?.id as string,
      },
    };

    // Ajouter les infos utilisateur si demandé et disponibles
    if (includeUser && request?.user) {
      const user = request.user as { userId: string; role: UserRole };
      response.meta.user = {
        userId: user.userId,
        role: user.role,
      };
    }

    return response;
  }

  static paginated<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
    request?: FastifyRequest,
    includeUser: boolean = true
  ): ApiResponse<{
    items: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }> {
    const response: ApiResponse<{
      items: T[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
      };
    }> = {
      success: true,
      data: {
        items,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        requestId: request?.id as string,
      },
    };

    // Ajouter les infos utilisateur si demandé et disponibles
    if (includeUser && request?.user) {
      const user = request.user as { userId: string; role: UserRole };
      response.meta.user = {
        userId: user.userId,
        role: user.role,
      };
    }

    return response;
  }

  static fromError(
    error: unknown,
    request?: FastifyRequest,
    defaultMessage: string = 'An unexpected error occurred'
  ): ApiResponse {
    const err = error as { code?: string; message?: string; details?: unknown };
    const errorCode = err.code || 'INTERNAL_ERROR';
    const message = err.message || defaultMessage;
    const details = err.details || undefined;

    return this.error(errorCode, message, request, details);
  }
}