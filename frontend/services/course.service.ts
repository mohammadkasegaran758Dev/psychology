// src/services/course.service.ts
import { api } from "@/lib/api-client";
import type {
  Course,
  CourseDetailsResponse,
  // GetCoursesParams,
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
  getCourses: (params?: GetCoursesParams) => {
    // حالا api.get<PaginatedResponse<Course>> => Promise<PaginatedResponse<Course>>
    return api.get<PaginatedResponse<Course>>("/courses", {
      params,
    });
  },

  getCourseBySlug: (slug: string) => {
    return api.get<CourseDetailsResponse>(`/courses/${slug}`);
  },
};
