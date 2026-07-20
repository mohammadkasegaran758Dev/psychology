// src/lib/api/api-client.ts
export {
  HttpApiError as ApiError,
  adminApi,
  storeApi,
} from "@/lib/http/create-api-client";
export const apiClient = storeApi;
