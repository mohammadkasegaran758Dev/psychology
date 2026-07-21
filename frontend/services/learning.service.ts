// src/services/learning.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { storeApi } from "@/lib/http/store-api";
import { unwrapApiResponse } from "@/lib/http/unwrap";
import type { Course } from "@/types/course";
import type { Lesson } from "@/types/lesson";

export type CourseContentResponse = {
  course: Course;
  lessons: Lesson[];
};

export const learningService = {
  getMyCourses: async () => {
    const res = await storeApi.get(endpoints.learning.myCourses);
    return unwrapApiResponse<Course[]>(res as any);
  },

  getCourseContent: async (courseId: string | number) => {
    const res = await storeApi.get(endpoints.learning.courseContent(courseId));
    return unwrapApiResponse<CourseContentResponse>(res as any);
  },
};
