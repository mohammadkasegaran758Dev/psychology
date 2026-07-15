// src/hooks/use-reorder-sections.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderSections } from "../services/sections-api";
import { toast } from "sonner"; // یا هر کتابخانه اعلاناتی که استفاده می‌کنید

export function useReorderSections(courseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderSections,
    onSuccess: () => {
      // بروزرسانی کش سرفصل‌ها بعد از تغییر ترتیب موفقیت‌آمیز
      queryClient.invalidateQueries({
        queryKey: ["course-sections", courseId],
      });
      toast.success("ترتیب سرفصل‌ها با موفقیت بروزرسانی شد.");
    },
    onError: () => {
      toast.error("خطا در تغییر ترتیب سرفصل‌ها.");
    },
  });
}
