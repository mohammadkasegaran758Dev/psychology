import { api } from "@/lib/api-client";
import type { CategoryFormValues } from "../schemas/category-schema";
import type { Category } from "../types/category";

type PaginatedCategoriesResponse = {
  data: {
    current_page: number;
    data: Category[];
    last_page: number;
    per_page: number;
    total: number;
  };
};

export const categoriesApi = {
  getAll: async (search?: string): Promise<Category[]> => {
    const { data } = await api.get<PaginatedCategoriesResponse>(
      "/admin/categories",
      {
        params: { search },
      },
    );

    return data.data.data;
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/admin/categories/${id}`);
    return data;
  },

  create: async (values: CategoryFormValues) => {
    const { data } = await api.post("/admin/categories", values);
    return data;
  },

  update: async (id: number, values: CategoryFormValues) => {
    const { data } = await api.put(`/admin/categories/${id}`, values);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/admin/categories/${id}`);
    return data;
  },
};
