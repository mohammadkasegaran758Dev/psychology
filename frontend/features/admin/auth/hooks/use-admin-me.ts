import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { getAdminToken } from "../lib/admin-auth-storage";

export function useAdminMe() {
  const token = typeof window !== "undefined" ? getAdminToken() : null;

  return useQuery({
    queryKey: ["admin", "auth", "me"],
    queryFn: authApi.me,
    enabled: !!token,
    retry: false,
  });
}
