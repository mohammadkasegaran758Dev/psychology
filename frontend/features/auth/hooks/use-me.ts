// src/features/auth/hooks/use-me.ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { getAuthToken } from "@/lib/auth/token";
import { queryKeys } from "@/lib/constants/query-keys";
import { authService } from "@/services/auth.service";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authService.me,
    enabled: Boolean(getAuthToken()),
    retry: false,
  });
}
