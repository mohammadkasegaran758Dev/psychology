import { api } from "@/lib/api-client";
import {
  unwrapLessonApi,
  type CreateLessonPayload,
  type Lesson,
  type LessonApiEnvelope,
  type UpdateLessonPayload,
} from "../types/lesson";

export async function getCourseLessons(courseId: number): Promise<Lesson[]> {
  const response = await api.get<LessonApiEnvelope<Lesson[]>>(
    "/admin/lessons",
    {
      params: {
        course_id: courseId,
      },
    },
  );

  return unwrapLessonApi(response.data);
}

export async function getLesson(lessonId: number): Promise<Lesson> {
  const response = await api.get<LessonApiEnvelope<Lesson>>(
    `/admin/lessons/${lessonId}`,
  );

  return unwrapLessonApi(response.data);
}

export async function createLesson(
  payload: CreateLessonPayload,
): Promise<Lesson> {
  const response = await api.post<LessonApiEnvelope<Lesson>>(
    "/admin/lessons",
    payload,
  );

  return unwrapLessonApi(response.data);
}

export async function updateLesson(
  lessonId: number,
  payload: UpdateLessonPayload,
): Promise<Lesson> {
  const response = await api.put<LessonApiEnvelope<Lesson>>(
    `/admin/lessons/${lessonId}`,
    payload,
  );

  return unwrapLessonApi(response.data);
}

export async function deleteLesson(lessonId: number): Promise<void> {
  await api.delete(`/admin/lessons/${lessonId}`);
}

export async function forceDeleteLesson(lessonId: number): Promise<void> {
  await api.delete(`/admin/lessons/${lessonId}/force`);
}
export async function reorderLessons(
  lessonIds: number[],
): Promise<{ message: string }> {
  const response = await api.patch("/admin/lessons/reorder", {
    ids: lessonIds,
  });
  return response.data;
}
