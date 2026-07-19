// src/features/auth/hooks/use-register.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setAuthToken } from "@/lib/auth/token";
import { queryKeys } from "@/lib/constants/query-keys";
import { authService } from "@/services/auth.service";

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: async (response) => {
      setAuthToken(response.data.token);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}
