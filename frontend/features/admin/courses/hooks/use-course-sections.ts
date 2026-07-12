import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SectionFormData } from "../schemas/section-schema";
import {
  createSection,
  deleteSection,
  getCourseSections,
  updateSection,
} from "../services/sections-api";

export function useCourseSections(courseId: number) {
  return useQuery({
    queryKey: ["course-sections", courseId],
    queryFn: () => getCourseSections(courseId),
    enabled: Boolean(courseId),
  });
}

export function useCreateSection(courseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SectionFormData) =>
      createSection({
        ...payload,
        course_id: courseId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-sections", courseId],
      });
    },
  });
}

export function useUpdateSection(courseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionId,
      payload,
    }: {
      sectionId: number;
      payload: Partial<SectionFormData>;
    }) => updateSection(sectionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-sections", courseId],
      });
    },
  });
}

export function useDeleteSection(courseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: number) => deleteSection(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-sections", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-lessons", courseId],
      });
    },
  });
}
