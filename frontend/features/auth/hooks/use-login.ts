// src/features/auth/hooks/use-login.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setAuthToken } from "@/lib/auth/token";
import { queryKeys } from "@/lib/constants/query-keys";
import { authService } from "@/services/auth.service";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    // onSuccess: async (response) => {
    //   setAuthToken(response.data.token);
    //   await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    // },

    onSuccess: async (response) => {
      const token = response?.data?.token;

      if (!token) {
        throw new Error("Login response missing token");
      }

      setAuthToken(token);

      await queryClient.invalidateQueries({
        queryKey: queryKeys.auth.me,
      });
    },
  });
}
