// // src/services/auth.service.ts
// import { storeApi } from "@/lib/http/store-api";
// import { unwrapApiResponse } from "@/lib/http/unwrap";
// import type { AuthResponse, LoginInput, RegisterInput } from "@/types/auth";
// import type { User } from "@/types/user";

// export const authService = {
//   async login(payload: LoginInput) {
//     const res = await storeApi.post<AuthResponse>("/login", payload);
//     // اگر بک { data: { user, token } } بدهد unwrap لازم است
//     // اگر الان raw { user, token } است، unwrap fallback همان را برمی‌گرداند
//     return unwrapApiResponse<AuthResponse>(res);
//   },

//   async register(payload: RegisterInput) {
//     const res = await storeApi.post<AuthResponse>("/register", payload);
//     return unwrapApiResponse<AuthResponse>(res);
//   },

//   async logout() {
//     const res = await storeApi.post<{ message: string }>("/logout");
//     return unwrapApiResponse<{ message: string }>(res);
//   },

//   async me() {
//     const res = await storeApi.get<User | { data: User }>("/me");
//     return unwrapApiResponse<User>(res as any);
//   },
// };
import { apiClient } from "@/lib/api/api-client";
import type { AuthResponse, LoginInput, RegisterInput } from "@/types/auth";
import type { User } from "@/types/user";

type MeResponse = {
  message: string;
  data: User;
};

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

  async me(): Promise<User> {
    const response = await apiClient.get<MeResponse>("/me");
    return response.data.data;
  },
};
