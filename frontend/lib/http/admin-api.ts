// src/lib/http/admin-api.ts
import {
  getAdminToken,
  removeAdminToken,
} from "@/features/admin/auth/lib/admin-auth-storage";
import { createApiClient } from "@/lib/http/create-api-client";

export const adminApi = createApiClient({
  scope: "admin",
  getToken: getAdminToken,
  clearToken: removeAdminToken,
  unauthorizedRedirect: "/admin/login",
});
