export type CourseCategory = {
  id: number;
  title: string;
  slug?: string;
};

export type CourseSectionLesson = {
  id: number;
  title: string;
  slug?: string;
  sort_order?: number;
  is_free_preview?: boolean;
  duration_minutes?: number | null;
};

export type CourseSection = {
  id: number;
  title: string;
  sort_order?: number;
  lessons?: CourseSectionLesson[];
};

export type Course = {
  id: number;
  category_id?: number | null;
  title: string;
  slug: string;
  type?: string | null;
  short_description?: string | null;
  description?: string | null;
  cover_image?: string | null;
  thumbnail?: string | null;
  price: number | string;
  discount_price?: number | string | null;
  status?: string;
  published_at?: string | null;
  created_by?: number | null;

  // accessors / computed
  final_price?: number | string;
  is_free?: boolean;

  // relations
  category?: CourseCategory | null;
  sections?: CourseSection[];
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type GetCoursesParams = {
  page?: number;
  per_page?: number;
  category_id?: number | string;
  search?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
};

export type CourseDetailsResponse = Course & {
  sections?: CourseSection[];
};
