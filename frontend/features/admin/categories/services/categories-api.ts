import axios from "axios"; // یا کلاینت ست شده با اینستنس اختصاصی پروژه شما
import { CategoryFormValues } from "../schemas/category-schema";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  coursesCount: number;
  status: "active" | "inactive";
  createdAt: string;
};

// فرض می‌کنیم baseUrl شما در اینستنس مشترک axios تنظیم شده است
const api = axios.create({
  baseURL: "/api/admin", // مسیر فرضی API پنل ادمین
});

export const categoriesApi = {
  getAll: async (search?: string) => {
    const { data } = await api.get<Category[]>("/categories", {
      params: { search },
    });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<Category>(`/categories/${id}`);
    return data;
  },

  create: async (values: CategoryFormValues) => {
    const { data } = await api.post<Category>("/categories", values);
    return data;
  },

  update: async (id: number, values: CategoryFormValues) => {
    const { data } = await api.put<Category>(`/categories/${id}`, values);
    return data;
  },

  delete: async (id: number) => {
    await api.delete(`/categories/${id}`);
  },
};
