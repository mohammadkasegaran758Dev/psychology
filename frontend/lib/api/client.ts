// src/lib/api/client.ts
/**
 * @deprecated Prefer `storeApi` from `@/lib/http` + unwrap helpers.
 * This adapter keeps old service signatures working during migration.
 */
import { storeApi } from "@/lib/http/store-api";
import { unwrapApiResponse } from "@/lib/http/unwrap";
import type { AxiosRequestConfig } from "axios";

type Options = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

function toConfig(options?: Options): AxiosRequestConfig {
  return {
    headers: options?.headers,
    signal: options?.signal,
  };
}

export const apiClient = {
  async get<T>(path: string, options?: Options): Promise<T> {
    const res = await storeApi.get(path, toConfig(options));
    return unwrapApiResponse<T>(res);
  },

  async post<T>(path: string, body?: unknown, options?: Options): Promise<T> {
    const res = await storeApi.post(path, body, toConfig(options));
    return unwrapApiResponse<T>(res);
  },

  async put<T>(path: string, body?: unknown, options?: Options): Promise<T> {
    const res = await storeApi.put(path, body, toConfig(options));
    return unwrapApiResponse<T>(res);
  },

  async patch<T>(path: string, body?: unknown, options?: Options): Promise<T> {
    const res = await storeApi.patch(path, body, toConfig(options));
    return unwrapApiResponse<T>(res);
  },

  async delete<T>(path: string, options?: Options): Promise<T> {
    const res = await storeApi.delete(path, toConfig(options));
    return unwrapApiResponse<T>(res);
  },
};
