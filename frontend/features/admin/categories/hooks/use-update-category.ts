import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories-api";
import type { CategoryFormValues } from "../schemas/category-schema";

type UpdateCategoryInput = {
  id: number;
  values: CategoryFormValues;
};

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: UpdateCategoryInput) =>
      categoriesApi.update(id, values),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "categories", variables.id],
      });
    },
  });
}
