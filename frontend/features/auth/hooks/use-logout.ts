// src/features/auth/hooks/use-logout.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeAuthToken } from "@/lib/auth/token";
import { queryKeys } from "@/lib/constants/query-keys";
import { authService } from "@/services/auth.service";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      removeAuthToken();
      await queryClient.removeQueries({ queryKey: queryKeys.auth.me });
    },
  });
}
