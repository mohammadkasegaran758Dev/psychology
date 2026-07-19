// src/features/categories/hooks/use-categories.ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";
import {
  categoryService,
  type GetCategoriesParams,
} from "@/services/category.service";

export function useCategories(params?: GetCategoriesParams) {
  return useQuery({
    queryKey: queryKeys.categories.list(params),
    queryFn: () => categoryService.getCategories(params),
  });
}
