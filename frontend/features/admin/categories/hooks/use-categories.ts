// import { useQuery } from "@tanstack/react-query";
// import { categoriesApi } from "../services/categories-api";

// export function useCategory(id: number) {
//   return useQuery({
//     queryKey: ["admin", "categories", id],
//     queryFn: () => categoriesApi.getById(id),
//     enabled: !!id,
//   });
// }

import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories-api";

export function useCategories(search?: string) {
  return useQuery({
    queryKey: ["admin", "categories", { search }],
    queryFn: () => categoriesApi.getAll(search),
  });
}
