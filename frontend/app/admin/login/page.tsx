"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  AdminLoginForm,
  useAdminLogin,
  type LoginFormValues,
} from "@/features/admin/auth";
import { setAdminToken } from "@/features/admin/auth/lib/admin-auth-storage";

export default function AdminLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginMutation = useAdminLogin();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginMutation.mutateAsync(values);

      if (response.user.role !== "admin" || response.user.status !== "active") {
        toast.error("شما دسترسی ورود به پنل مدیریت را ندارید");
        return;
      }

      setAdminToken(response.token);

      queryClient.setQueryData(["admin", "auth", "me"], response.user);

      toast.success("با موفقیت وارد شدید");
      router.push("/admin/categories");
    } catch (error) {
      toast.error("ورود ناموفق بود");
      console.error(error);
    }
  };

  return (
    // <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
    <AdminLoginForm
      isSubmitting={loginMutation.isPending}
      onSubmit={handleSubmit}
    />
    // </div>
  );
}
