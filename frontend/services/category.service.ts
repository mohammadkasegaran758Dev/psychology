// src/services/category.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { storeApi } from "@/lib/http/store-api";
import { unwrapApiResponse, unwrapPaginated } from "@/lib/http/unwrap";
import type { Category } from "@/types/category";

export type GetCategoriesParams = {
  page?: number;
  per_page?: number;
};

function buildCategoriesQuery(params?: GetCategoriesParams) {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const categoryService = {
  getCategories: async (params?: GetCategoriesParams) => {
    const res = await storeApi.get(
      `${endpoints.categories.list}${buildCategoriesQuery(params)}`,
    );
    return unwrapPaginated<Category>(res as any);
  },

  getCategoryBySlug: async (slug: string) => {
    const res = await storeApi.get(endpoints.categories.detail(slug));
    return unwrapApiResponse<Category>(res as any);
  },
};
