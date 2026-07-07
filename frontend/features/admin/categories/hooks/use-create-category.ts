import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories-api";
import type { CategoryFormValues } from "../schemas/category-schema";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CategoryFormValues) => categoriesApi.create(values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "categories"],
      });
    },
  });
}
