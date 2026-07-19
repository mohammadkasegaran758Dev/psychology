// src/features/courses/hooks/use-course-details.ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";
import { courseService } from "@/services/course.service";

export function useCourseDetails(slug: string) {
  return useQuery({
    queryKey: queryKeys.courses.detail(slug),
    queryFn: () => courseService.getCourseBySlug(slug),
    enabled: Boolean(slug),
  });
}
