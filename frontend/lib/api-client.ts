import axios from "axios";
import {
  getAdminToken,
  removeAdminToken,
} from "@/features/admin/auth/lib/admin-auth-storage";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAdminToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAdminToken();

      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  },
);
