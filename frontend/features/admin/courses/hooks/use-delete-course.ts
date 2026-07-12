"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coursesApi } from "../services/courses-api";

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => coursesApi.delete(id),
    onSuccess: () => {
      toast.success("دوره با موفقیت حذف شد");
      queryClient.invalidateQueries({
        queryKey: ["admin", "courses"],
      });
    },
    onError: () => {
      toast.error("حذف دوره ناموفق بود");
    },
  });
}
