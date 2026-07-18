// src/services/course.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { Course } from "@/types/course";
import type { PaginatedResponse } from "@/types/api";

export type GetCoursesParams = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
};

function buildCoursesQuery(params?: GetCoursesParams) {
  const searchParams = new URLSearchParams();

  if (!params) return "";

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.category) searchParams.set("category", params.category);
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const courseService = {
  getCourses: async (params?: GetCoursesParams) => {
    const query = buildCoursesQuery(params);
    return apiClient.get<PaginatedResponse<Course>>(
      `${endpoints.courses.list}${query}`,
    );
  },

  getCourseBySlug: async (slug: string) => {
    return apiClient.get<Course>(endpoints.courses.detail(slug));
  },
};
