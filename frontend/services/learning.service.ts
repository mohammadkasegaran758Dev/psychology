// src/services/learning.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { unwrapApiResponse } from "@/lib/http/unwrap";
import type { ApiResponse } from "@/lib/http/types";
import type { Course } from "@/types/course";
import type { Lesson } from "@/types/lesson";

export type CourseContentResponse = {
  course: Course;
  lessons: Lesson[];
};

export const learningService = {
  getMyCourses: async () => {
    const response = await apiClient.get<ApiResponse<Course[]>>(
      endpoints.learning.myCourses,
    );
    return unwrapApiResponse(response.data);
  },

  getCourseContent: async (courseId: string | number) => {
    const response = await apiClient.get<ApiResponse<CourseContentResponse>>(
      endpoints.learning.courseContent(courseId),
    );
    return unwrapApiResponse(response.data);
  },
};
