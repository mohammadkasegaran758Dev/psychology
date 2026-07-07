import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories-api";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      // بعد از حذف موفق، لیست دسته‌بندی‌ها دوباره معتبرسازی و کش آن بروز می‌شود
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}
