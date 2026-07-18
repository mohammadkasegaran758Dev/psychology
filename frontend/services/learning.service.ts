// src/services/learning.service.ts
import { endpoints } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { Course } from "@/types/course";
import type { Lesson } from "@/types/lesson";

export type CourseContentResponse = {
  course: Course;
  lessons: Lesson[];
};

export const learningService = {
  getMyCourses: async () => {
    return apiClient.get<Course[]>(endpoints.learning.myCourses);
  },

  getCourseContent: async (courseId: string | number) => {
    return apiClient.get<CourseContentResponse>(
      endpoints.learning.courseContent(courseId),
    );
  },
};
