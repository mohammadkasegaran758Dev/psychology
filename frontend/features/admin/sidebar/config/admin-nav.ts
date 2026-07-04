import {
  LayoutDashboard,
  Layers3,
  BookOpen,
  Users,
  ShoppingCart,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavSubItem[];
}

export const adminNavItems: NavItem[] = [
  {
    title: "داشبورد",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "دسته‌بندی‌ها",
    url: "/admin/categories",
    icon: Layers3,
    items: [
      {
        title: "لیست دسته‌بندی‌ها",
        url: "/admin/categories",
      },
      {
        title: "ایجاد دسته‌بندی",
        url: "/admin/categories/create",
      },
    ],
  },
  {
    title: "دوره‌ها",
    url: "/admin/courses",
    icon: BookOpen,
    items: [
      {
        title: "لیست دوره‌ها",
        url: "/admin/courses",
      },
      {
        title: "ایجاد دوره",
        url: "/admin/courses/create",
      },
    ],
  },
  {
    title: "ثبت‌نام‌ها",
    url: "/admin/enrollments",
    icon: Users,
  },
  {
    title: "سفارش‌ها",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "تنظیمات",
    url: "/admin/settings",
    icon: Settings,
  },
];
