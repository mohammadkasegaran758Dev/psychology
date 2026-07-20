// src/services/course.service.ts
import { api } from "@/lib/api-client";
import { unwrapApiResponse } from "@/lib/http/unwrap";
import type { ApiResponse } from "@/lib/http/types";
import type {
  Course,
  CourseDetailsResponse,
  PaginatedResponse,
} from "@/types/course";

export type GetCoursesParams = {
  page?: number;
  per_page?: number;
  category_id?: number | string;
  search?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
};

export const courseService = {
  getCourses: async (params?: GetCoursesParams) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Course>>>(
      "/courses",
      {
        params,
      },
    );
    return unwrapApiResponse(response.data);
  },

  getCourseBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<CourseDetailsResponse>>(
      `/courses/${slug}`,
    );
    return unwrapApiResponse(response.data);
  },
};
