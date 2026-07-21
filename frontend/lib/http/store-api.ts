// src/lib/http/store-api.ts
import { getAuthToken, removeAuthToken } from "@/lib/auth/token";
import { createApiClient } from "@/lib/http/create-api-client";

export const storeApi = createApiClient({
  scope: "store",
  getToken: getAuthToken,
  clearToken: removeAuthToken,
  unauthorizedRedirect: "/login",
});
