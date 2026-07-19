// src/features/courses/hooks/use-courses.ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";
import {
  courseService,
  type GetCoursesParams,
} from "@/services/course.service";

export function useCourses(params?: GetCoursesParams) {
  return useQuery({
    queryKey: queryKeys.courses.list(params),
    queryFn: () => courseService.getCourses(params),
  });
}
