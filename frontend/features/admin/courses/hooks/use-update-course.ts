"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coursesApi } from "../services/courses-api";
import type { CourseFormValues } from "../schemas/course-schema";

type UpdateCoursePayload = {
  id: number;
  values: CourseFormValues;
};

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: UpdateCoursePayload) =>
      coursesApi.update(id, values),
    onSuccess: (_, variables) => {
      toast.success("دوره با موفقیت بروزرسانی شد");

      queryClient.invalidateQueries({
        queryKey: ["admin", "courses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "courses", variables.id],
      });
    },
    onError: () => {
      toast.error("بروزرسانی دوره ناموفق بود");
    },
  });
}
