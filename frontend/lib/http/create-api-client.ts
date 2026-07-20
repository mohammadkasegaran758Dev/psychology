import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import {
  getAdminToken,
  removeAdminToken,
} from "@/features/admin/auth/lib/admin-auth-storage";
import { getAuthToken, removeAuthToken } from "@/lib/auth/token";
import type { ApiErrorPayload } from "./types";

export type ApiClientMode = "store" | "admin";

type CreateApiClientOptions = {
  mode: ApiClientMode;
  baseURL?: string;
  redirectTo?: string;
};

function getToken(mode: ApiClientMode): string | null {
  if (mode === "admin") {
    return getAdminToken();
  }

  return getAuthToken();
}

function removeToken(mode: ApiClientMode): void {
  if (mode === "admin") {
    removeAdminToken();
    return;
  }

  removeAuthToken();
}

function buildErrorPayload(error: unknown): ApiErrorPayload {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as ApiErrorPayload | undefined;
    return {
      message: responseData?.message ?? error.message ?? "Request failed",
      errors: responseData?.errors,
    };
  }

  return { message: "Request failed" };
}

export function createApiClient({
  mode,
  baseURL,
  redirectTo,
}: CreateApiClientOptions): AxiosInstance {
  const client = axios.create({
    baseURL:
      baseURL ??
      process.env.NEXT_PUBLIC_API_URL ??
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      "http://localhost:8000/api",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    const token = getToken(mode);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status ?? 500;
      const payload = buildErrorPayload(error);

      if (status === 401) {
        removeToken(mode);

        if (typeof window !== "undefined" && redirectTo) {
          window.location.href = redirectTo;
        }
      }

      return Promise.reject({
        message: payload.message,
        errors: payload.errors,
        status,
        data: error.response?.data,
      });
    },
  );

  return client;
}

export const adminApi = createApiClient({
  mode: "admin",
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL,
  redirectTo: "/admin/login",
});

export const storeApi = createApiClient({
  mode: "store",
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL,
  redirectTo: "/login",
});
