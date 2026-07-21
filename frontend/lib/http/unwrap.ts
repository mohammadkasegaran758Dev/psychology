// src/lib/http/unwrap.ts
import type { AxiosResponse } from "axios";
import type { ApiResponse, PaginationMeta } from "@/lib/http/types";

/**
 * AxiosResponse -> body
 * اگر بک { data, message?, meta? } بدهد، همان data را برمی‌گرداند.
 * اگر فعلاً raw باشد، کل body را برمی‌گرداند (مرحله گذار).
 */
export function unwrapApiResponse<T>(
  response: AxiosResponse<ApiResponse<T> | T>,
): T {
  const body = response.data;

  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    (body as ApiResponse<T>).data !== undefined
  ) {
    return (body as ApiResponse<T>).data;
  }

  return body as T;
}

/** وقتی هم data و هم meta لازم است (لیست‌های paginate) */
export function unwrapPaginated<T>(response: AxiosResponse<ApiResponse<T[]>>): {
  data: T[];
  meta?: PaginationMeta;
  message?: string;
} {
  const body = response.data;

  if (body && typeof body === "object" && "data" in body) {
    return {
      data: body.data,
      meta: body.meta,
      message: body.message,
    };
  }

  // fallback گذار
  return { data: body as unknown as T[] };
}

/** فقط message از envelope */
export function unwrapMessage(
  response: AxiosResponse<ApiResponse<unknown> | { message?: string }>,
): string | undefined {
  const body = response.data;
  if (body && typeof body === "object" && "message" in body) {
    return body.message;
  }
  return undefined;
}
