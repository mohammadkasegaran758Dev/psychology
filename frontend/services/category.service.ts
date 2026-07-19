// src/services/category.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { Category } from "@/types/category";
import type { PaginatedResponse } from "@/types/api";

export type GetCategoriesParams = {
  page?: number;
  limit?: number;
};

function buildCategoriesQuery(params?: GetCategoriesParams) {
  const searchParams = new URLSearchParams();

  if (!params) return "";

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const categoryService = {
  getCategories: async (params?: GetCategoriesParams) => {
    const query = buildCategoriesQuery(params);
    return apiClient.get<PaginatedResponse<Category>>(
      `${endpoints.categories.list}${query}`,
    );
  },

  getCategoryBySlug: async (slug: string) => {
    return apiClient.get<Category>(endpoints.categories.detail(slug));
  },
};
