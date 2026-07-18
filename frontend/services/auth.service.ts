// src/services/auth.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { AuthResponse, LoginInput, RegisterInput } from "@/types/auth";
import type { User } from "@/types/user";

export const authService = {
  login: async (payload: LoginInput) => {
    return apiClient.post<AuthResponse>(endpoints.auth.login, payload);
  },

  register: async (payload: RegisterInput) => {
    return apiClient.post<AuthResponse>(endpoints.auth.register, payload);
  },

  me: async () => {
    return apiClient.get<User>(endpoints.auth.me);
  },

  logout: async () => {
    return apiClient.post<{ success: boolean }>(endpoints.auth.logout);
  },
};
