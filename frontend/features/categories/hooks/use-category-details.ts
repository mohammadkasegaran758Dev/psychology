// src/features/categories/hooks/use-category-details.ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";
import { categoryService } from "@/services/category.service";

export function useCategoryDetails(slug: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(slug),
    queryFn: () => categoryService.getCategoryBySlug(slug),
    enabled: Boolean(slug),
  });
}
