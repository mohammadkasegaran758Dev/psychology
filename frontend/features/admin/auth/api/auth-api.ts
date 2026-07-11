import { api } from "@/lib/api-client";
import type { AdminLoginResponse, AdminUser } from "../types/auth-types";

type LoginPayload = {
  email: string;
  password: string;
};

export const authApi = {
  login: async (payload: LoginPayload): Promise<AdminLoginResponse> => {
    const { data } = await api.post("/admin/login", payload);
    return data;
  },

  me: async (): Promise<AdminUser> => {
    const { data } = await api.get("/admin/me");
    return data;
  },

  logout: async () => {
    const { data } = await api.post("/admin/logout");
    return data;
  },
};
