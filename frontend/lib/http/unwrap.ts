import type { ApiResponse } from "./types";

export function unwrapApiResponse<T>(payload: ApiResponse<T> | T): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    const value = (payload as ApiResponse<T>).data;
    if (value !== undefined) {
      return value as T;
    }
  }

  return payload as T;
}
