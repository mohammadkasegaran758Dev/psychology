// // src/hooks/use-reorder-lessons.ts
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { reorderLessons } from "../services/lessons-api";
// import { toast } from "sonner";

// export function useReorderLessons(courseId: number) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: reorderLessons,
//     onSuccess: () => {
//       // بروزرسانی درس‌ها پس از جابجایی موفقیت‌آمیز
//       queryClient.invalidateQueries({ queryKey: ["course-lessons", courseId] });
//       toast.success("ترتیب درس‌ها با موفقیت بروزرسانی شد.");
//     },
//     onError: () => {
//       toast.error("خطا در تغییر ترتیب درس‌ها.");
//     },
//   });
// }
// src/hooks/use-reorder-lessons.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { reorderLessons } from "../services/lessons-api";
import type { Lesson } from "../types/lesson";

export function useReorderLessons(courseId: number) {
  const queryClient = useQueryClient();
  const queryKey = ["course-lessons", courseId] as const;

  return useMutation({
    mutationFn: reorderLessons,

    onMutate: async (lessonIds: number[]) => {
      await queryClient.cancelQueries({ queryKey });

      const previousLessons = queryClient.getQueryData<Lesson[]>(queryKey);
      const orderById = new Map(
        lessonIds.map((lessonId, index) => [lessonId, index + 1]),
      );

      queryClient.setQueryData<Lesson[]>(queryKey, (currentLessons = []) =>
        currentLessons.map((lesson) => {
          const sortOrder = orderById.get(lesson.id);

          return sortOrder === undefined
            ? lesson
            : {
                ...lesson,
                sort_order: sortOrder,
              };
        }),
      );

      return { previousLessons };
    },

    onSuccess: () => {
      toast.success("ترتیب درس‌ها با موفقیت بروزرسانی شد.");
    },

    onError: (_error, _lessonIds, context) => {
      if (context?.previousLessons) {
        queryClient.setQueryData(queryKey, context.previousLessons);
      }

      toast.error("خطا در تغییر ترتیب درس‌ها.");
    },

    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey });
    },
  });
}
