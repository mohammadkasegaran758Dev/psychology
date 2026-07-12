import { api } from "@/lib/api-client";
import type { Course, CategoryOption } from "../types/course";
import type { CourseFormValues } from "../schemas/course-schema";

type PaginatedCoursesResponse = {
  current_page: number;
  data: Course[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

type CourseShowResponse = {
  data: Course;
};

type CourseMutationResponse = {
  message: string;
  data: Course;
};

type CategoryOptionsResponse =
  | CategoryOption[]
  | {
      data: CategoryOption[];
    };

export const coursesApi = {
  getAll: async (params?: {
    page?: number;
    search?: string;
  }): Promise<PaginatedCoursesResponse> => {
    const { data } = await api.get<PaginatedCoursesResponse>("/admin/courses", {
      params,
    });

    return data;
  },

  getById: async (id: number): Promise<Course> => {
    const { data } = await api.get<CourseShowResponse>(`/admin/courses/${id}`);
    return data.data;
  },

  create: async (values: CourseFormValues): Promise<Course> => {
    const payload = {
      ...values,
      category_id:
        values.category_id === undefined ||
        values.category_id === null ||
        Number(values.category_id) === 0
          ? null
          : Number(values.category_id),
      short_description: values.short_description || null,
      description: values.description || null,
      cover_image: values.cover_image || null,
      discount_price:
        values.discount_price === undefined ||
        values.discount_price === null ||
        values.discount_price === ("" as never)
          ? null
          : Number(values.discount_price),
      price: Number(values.price),
    };

    const { data } = await api.post<CourseMutationResponse>(
      "/admin/courses",
      payload,
    );

    return data.data;
  },

  update: async (id: number, values: CourseFormValues): Promise<Course> => {
    const payload = {
      ...values,
      category_id:
        values.category_id === undefined ||
        values.category_id === null ||
        Number(values.category_id) === 0
          ? null
          : Number(values.category_id),
      short_description: values.short_description || null,
      description: values.description || null,
      cover_image: values.cover_image || null,
      discount_price:
        values.discount_price === undefined ||
        values.discount_price === null ||
        values.discount_price === ("" as never)
          ? null
          : Number(values.discount_price),
      price: Number(values.price),
    };

    const { data } = await api.put<CourseMutationResponse>(
      `/admin/courses/${id}`,
      payload,
    );

    return data.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(
      `/admin/courses/${id}`,
    );
    return data;
  },

  getCategoryOptions: async (): Promise<CategoryOption[]> => {
    const { data } = await api.get<CategoryOptionsResponse>(
      "/admin/categories/options",
    );

    if (Array.isArray(data)) {
      return data;
    }

    return data.data ?? [];
  },
};
