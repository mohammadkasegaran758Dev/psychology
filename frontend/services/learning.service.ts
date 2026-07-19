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
  getMyCourses: () => {
    // apiClient.get مستقیماً آرایه Course[] را برمی‌گرداند
    return apiClient.get<Course[]>(endpoints.learning.myCourses);
  },

  getCourseContent: (courseId: string | number) => {
    // apiClient.get مستقیماً CourseContentResponse را برمی‌گرداند
    return apiClient.get<CourseContentResponse>(
      endpoints.learning.courseContent(courseId),
    );
  },
};
