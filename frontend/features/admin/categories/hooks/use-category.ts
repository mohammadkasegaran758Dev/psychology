import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories-api";

export function useCategory(id: number) {
  return useQuery({
    queryKey: ["admin", "categories", id],
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  });
}
