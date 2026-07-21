// src/services/course.service.ts
import { storeApi } from "@/lib/http/store-api";
import { unwrapApiResponse, unwrapPaginated } from "@/lib/http/unwrap";
import type {
  Course,
  CourseDetailsResponse,
  GetCoursesParams,
} from "@/types/course";

export const courseService = {
  getCourses: async (params?: GetCoursesParams) => {
    // اگر GetCoursesParams هنوز limit دارد، همین‌جا map کن:
    const query = {
      ...params,
      per_page:
        (params as any)?.per_page ?? (params as any)?.limit ?? undefined,
      limit: undefined,
    };

    const res = await storeApi.get("/courses", { params: query });
    return unwrapPaginated<Course>(res as any);
  },

  getCourseBySlug: async (slug: string) => {
    const res = await storeApi.get(`/courses/${slug}`);
    return unwrapApiResponse<CourseDetailsResponse>(res as any);
  },
};
