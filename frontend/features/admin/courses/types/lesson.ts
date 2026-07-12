
export const lessonContentTypes = ["video", "audio", "text", "file"] as const;

export type LessonContentType = (typeof lessonContentTypes)[number];

export interface Lesson {
  id: number;
  course_id: number;
  section_id: number;
  title: string;
  slug: string | null;
  description: string | null;
  content_type: LessonContentType;
  content: string | null;
  video_url: string | null;
  audio_url: string | null;
  file_path: string | null;
  duration_minutes: number | null;
  is_free_preview: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface LessonPayloadBase {
  section_id: number;
  title: string;
  slug?: string | null;
  description?: string | null;
  content_type: LessonContentType;
  content?: string | null;
  video_url?: string | null;
  audio_url?: string | null;
  file_path?: string | null;
  duration_minutes?: number | null;
  is_free_preview?: boolean;
  sort_order?: number;
  is_published?: boolean;
}

export interface CreateLessonPayload extends LessonPayloadBase {
  course_id: number;
}

export interface UpdateLessonPayload extends LessonPayloadBase {
  course_id: number;
}

export type LessonApiEnvelope<T> = T | { data: T } | { data: { data: T } };

export function unwrapLessonApi<T>(payload: LessonApiEnvelope<T>): T {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data &&
    typeof payload.data === "object" &&
    "data" in payload.data
  ) {
    return payload.data.data as T;
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
}
