import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "../api/auth-api";
import { removeAdminToken } from "../lib/admin-auth-storage";

export function useAdminLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),

    // چه درخواستی موفق بود چه با خطا مواجه شد (مثلاً توکن قبلاً منقضی شده)،
    // ما باید کاربر را از فرانت خارج کنیم.
    onSettled: () => {
      // ۱. پاک کردن توکن
      removeAdminToken();

      // ۲. پاک کردن تمام کش مربوط به ادمین (مثلاً اطلاعات پروفایل)
      queryClient.removeQueries({ queryKey: ["admin"] });

      // ۳. انتقال به صفحه لاگین
      router.replace("/admin/login");

      toast.success("با موفقیت خارج شدید");
    },
  });
}
