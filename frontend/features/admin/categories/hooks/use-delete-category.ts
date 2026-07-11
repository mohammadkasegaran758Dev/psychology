"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories-api";
import { toast } from "sonner";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      toast.success("دسته بندی با موفقیت حذف شد");
      queryClient.invalidateQueries({
        queryKey: ["admin", "categories"],
      });
    },
    onError: () => {
      toast.error("حذف دسته بندی ناموفق بود");
    },
  });
}
