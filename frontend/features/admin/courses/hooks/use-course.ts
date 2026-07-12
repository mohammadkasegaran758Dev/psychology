"use client";

import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "../services/courses-api";

export function useCourse(id: number) {
  return useQuery({
    queryKey: ["admin", "courses", id],
    queryFn: () => coursesApi.getById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}
