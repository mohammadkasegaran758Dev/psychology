// src/lib/api/client.ts
import { fetcher, type FetcherOptions } from "@/lib/api/fetcher";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function buildUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<FetcherOptions, "method" | "body">) =>
    fetcher<T>(buildUrl(path), {
      ...options,
      method: "GET",
    }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<FetcherOptions, "method" | "body">,
  ) =>
    fetcher<T>(buildUrl(path), {
      ...options,
      method: "POST",
      body,
    }),

  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<FetcherOptions, "method" | "body">,
  ) =>
    fetcher<T>(buildUrl(path), {
      ...options,
      method: "PUT",
      body,
    }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<FetcherOptions, "method" | "body">,
  ) =>
    fetcher<T>(buildUrl(path), {
      ...options,
      method: "PATCH",
      body,
    }),

  delete: <T>(
    path: string,
    options?: Omit<FetcherOptions, "method" | "body">,
  ) =>
    fetcher<T>(buildUrl(path), {
      ...options,
      method: "DELETE",
    }),
};
