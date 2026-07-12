"use client";

import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "../services/courses-api";

export function useCourses(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: ["admin", "courses", params],
    queryFn: () => coursesApi.getAll(params),
  });
}
