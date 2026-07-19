// src/lib/api/handle-laravel-errors.ts
import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { ApiError } from "@/lib/api/api-client";

export function handleLaravelErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
): boolean {
  if (error instanceof ApiError && error.status === 422) {
    const data = error.data as { errors?: Record<string, string[]> };
    if (data?.errors) {
      Object.entries(data.errors).forEach(([key, messages]) => {
        if (messages && messages.length > 0) {
          setError(key as Path<TFieldValues>, {
            type: "server",
            message: messages[0], // اولین پیام خطای ارسالی از سمت سرور
          });
        }
      });
      return true;
    }
  }
  return false;
}
