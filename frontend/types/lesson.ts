// src/types/lesson.ts
export type LessonContentType = "video" | "audio" | "file" | "text" | string;

export type Lesson = {
  id: number;
  course_id: number;
  section_id: number | null;
  title: string;
  slug: string;
  content_type: LessonContentType;
  video_url: string | null;
  audio_url: string | null;
  file_path: string | null;
  content: string | null;
  duration_minutes: number;
  is_free_preview: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type CourseSection = {
  id: number;
  course_id: number;
  title: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  lessons?: Lesson[];
};
