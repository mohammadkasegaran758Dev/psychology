export type CourseType = "full_course" | "mini_course";
export type CourseStatus = "draft" | "published" | "archived";

export type CourseCategory = {
  id: number;
  title: string;
  slug: string;
};

export type CourseCreator = {
  id: number;
  name: string;
  email: string;
};

export type CourseLesson = {
  id: number;
  course_id: number;
  section_id: number;
  title: string;
  slug: string;
  content_type: "video" | "audio" | "text" | "file";
  video_url: string | null;
  audio_url: string | null;
  file_path: string | null;
  content: string | null;
  duration_minutes: number | null;
  is_free_preview: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type Course = {
  id: number;
  category_id: number | null;
  title: string;
  slug: string;
  type: CourseType;
  short_description: string | null;
  description: string | null;
  cover_image: string | null;
  price: string | number;
  discount_price: string | number | null;
  status: CourseStatus;
  published_at: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  category?: CourseCategory | null;
  creator?: CourseCreator | null;
  lessons?: CourseLesson[];
};

export type CategoryOption = {
  id: number;
  title: string;
};
