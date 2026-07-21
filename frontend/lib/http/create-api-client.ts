// src/lib/http/create-api-client.ts
import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { ApiError, ApiErrorPayload } from "@/lib/http/types";

export type ApiClientScope = "admin" | "store";

export type CreateApiClientOptions = {
  scope: ApiClientScope;
  getToken: () => string | null;
  clearToken: () => void;
  /** مسیر ریدایرکت بعد از 401؛ اگر null باشد فقط توکن پاک می‌شود */
  unauthorizedRedirect: string | null;
};

function resolveBaseURL() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api"
  );
}

export function createApiClient(
  options: CreateApiClientOptions,
): AxiosInstance {
  const instance = axios.create({
    baseURL: resolveBaseURL(),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = options.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // برای FormData نباید Content-Type دستی JSON بماند
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers && "Content-Type" in config.headers) {
        delete config.headers["Content-Type"];
      }
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorPayload>) => {
      const status = error.response?.status ?? 500;
      const data = error.response?.data;
      const message = data?.message || error.message || "Request failed.";
        
      if (status === 401) {
        options.clearToken();

        if (
          options.unauthorizedRedirect &&
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith(options.unauthorizedRedirect)
        ) {
          window.location.href = options.unauthorizedRedirect;
        }
      }

      return Promise.reject(new ApiError(message, status, data));
    },
  );

  return instance;
}
