// src/types/api.ts
export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiMessageResponse = {
  message: string;
};

export type Nullable<T> = T | null;
