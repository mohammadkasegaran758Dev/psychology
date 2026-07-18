// src/types/course.ts
import type { Category } from "@/types/category";
import type { CourseSection, Lesson } from "@/types/lesson";
import type { User } from "@/types/user";

export type CourseType = "recorded" | "live" | string;
export type CourseStatus = "draft" | "published" | "archived" | string;

export type Course = {
  id: number;
  category_id: number | null;
  title: string;
  slug: string;
  type: CourseType;
  short_description: string | null;
  description: string | null;
  cover_image: string | null;
  price: number | string;
  discount_price: number | string | null;
  status: CourseStatus;
  published_at: string | null;
  created_by: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;

  is_free?: boolean;
  final_price?: number;

  category?: Category | null;
  creator?: User | null;
  sections?: CourseSection[];
  lessons?: Lesson[];
};
