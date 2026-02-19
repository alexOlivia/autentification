import type { ApiResponse, PaginatedResponse, PaginationMeta } from '../types/common.js';

export function success<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function error(code: string, message: string, details?: unknown): ApiResponse<never> {
  return { success: false, error: { code, message, details } };
}

export function paginated<T>(data: T[], meta: PaginationMeta): PaginatedResponse<T> {
  return { success: true, data, meta };
}
