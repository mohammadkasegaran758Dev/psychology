"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coursesApi } from "../services/courses-api";
import type { CourseFormValues } from "../schemas/course-schema";

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CourseFormValues) => coursesApi.create(values),
    onSuccess: () => {
      toast.success("دوره با موفقیت ایجاد شد");
      queryClient.invalidateQueries({
        queryKey: ["admin", "courses"],
      });
    },
    onError: () => {
      toast.error("ایجاد دوره ناموفق بود");
    },
  });
}
