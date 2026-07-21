// src/lib/http/types.ts

export type PaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

/** قرارداد واحد موفقیت API */
export type ApiResponse<T> = {
  data: T;
  message?: string;
  meta?: PaginationMeta;
};

/** بدنه خطای Laravel-style */
export type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}
