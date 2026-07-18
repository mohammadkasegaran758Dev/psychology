// src/types/category.ts
import type { Course } from "@/types/course";

export type Category = {
  id: number;
  parent_id: number | null;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;

  parent?: Category | null;
  children?: Category[];
  childrenRecursive?: Category[];
  courses?: Course[];
};
