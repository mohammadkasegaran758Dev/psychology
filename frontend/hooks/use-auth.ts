// src/hooks/use-auth.ts
"use client";

import { useLogin } from "@/features/auth/hooks/use-login";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useMe } from "@/features/auth/hooks/use-me";
import { useRegister } from "@/features/auth/hooks/use-register";

export function useAuth() {
  const meQuery = useMe();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  return {
    user: meQuery.data,
    isAuthenticated: Boolean(meQuery.data),
    isLoading: meQuery.isLoading,

    meQuery,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    loginMutation,
    registerMutation,
    logoutMutation,
  };
}
