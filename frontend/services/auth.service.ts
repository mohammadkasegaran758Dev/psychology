// src/services/auth.service.ts
import { apiClient } from "@/lib/api/api-client";
import type { AuthResponse, LoginInput, RegisterInput } from "@/types/auth";
import type { User } from "@/types/user";

export const authService = {
  async login(payload: LoginInput) {
    const response = await apiClient.post<AuthResponse>("/login", payload);
    return response.data;
  },

  async register(payload: RegisterInput) {
    const response = await apiClient.post<AuthResponse>("/register", payload);
    return response.data;
  },

  async logout() {
    const response = await apiClient.post<{ message: string }>("/logout");
    return response.data;
  },

  async me() {
    const response = await apiClient.get<User>("/me");
    return response.data;
  },
};
