// src/services/category.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { unwrapApiResponse } from "@/lib/http/unwrap";
import type { ApiResponse, PaginationMeta } from "@/lib/http/types";
import type { Category } from "@/types/category";

export type GetCategoriesParams = {
  page?: number;
  per_page?: number;
};

function buildCategoriesQuery(params?: GetCategoriesParams) {
  const searchParams = new URLSearchParams();

  if (!params) return "";

  if (params.page) searchParams.set("page", String(params.page));
  if (params.per_page) searchParams.set("per_page", String(params.per_page));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const categoryService = {
  getCategories: async (params?: GetCategoriesParams) => {
    const query = buildCategoriesQuery(params);
    const response = await apiClient.get<
      ApiResponse<{ data: Category[]; meta: PaginationMeta }>
    >(`${endpoints.categories.list}${query}`);
    return unwrapApiResponse(response.data);
  },

  getCategoryBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<Category>>(
      endpoints.categories.detail(slug),
    );
    return unwrapApiResponse(response.data);
  },
};
