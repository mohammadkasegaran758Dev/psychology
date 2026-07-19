// src/lib/api/api-client.ts
import axios from "axios";

import { getAuthToken, removeAuthToken } from "@/lib/auth/token";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? 500;
    const data = error.response?.data;
    const message = data?.message ?? error.message ?? "Request failed.";

    if (status === 401) {
      removeAuthToken();
    }

    return Promise.reject(new ApiError(message, status, data));
  },
);
