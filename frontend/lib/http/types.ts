export type ApiResponse<T> = {
  data: T;
  message?: string;
  meta?: PaginationMeta;
};

export type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string[]>;
};

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
  data?: unknown;
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
};
