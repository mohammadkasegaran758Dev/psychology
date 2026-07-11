import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { setAdminToken } from "../lib/admin-auth-storage";

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: async (response) => {
      setAdminToken(response.token);

      queryClient.setQueryData(["admin", "auth", "me"], response.user);
    },
  });
}
