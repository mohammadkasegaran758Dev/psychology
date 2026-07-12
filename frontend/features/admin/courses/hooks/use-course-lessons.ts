import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateLessonPayload, UpdateLessonPayload } from "../types/lesson";
import {
  createLesson,
  deleteLesson,
  getCourseLessons,
  updateLesson,
} from "../services/lessons-api";

export function useCourseLessons(courseId: number) {
  return useQuery({
    queryKey: ["course-lessons", courseId],
    queryFn: () => getCourseLessons(courseId),
    enabled: Boolean(courseId),
  });
}

export function useCreateLesson(courseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionId,
      payload,
    }: {
      sectionId: number;
      payload: Omit<CreateLessonPayload, "course_id" | "section_id">;
    }) =>
      createLesson({
        ...payload,
        course_id: courseId,
        section_id: sectionId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-lessons", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-sections", courseId],
      });
    },
  });
}

export function useUpdateLesson(courseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      sectionId,
      payload,
    }: {
      lessonId: number;
      sectionId: number;
      payload: Omit<UpdateLessonPayload, "course_id" | "section_id">;
    }) =>
      updateLesson(lessonId, {
        ...payload,
        course_id: courseId,
        section_id: sectionId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-lessons", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-sections", courseId],
      });
    },
  });
}

export function useDeleteLesson(courseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: number) => deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-lessons", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-sections", courseId],
      });
    },
  });
}
