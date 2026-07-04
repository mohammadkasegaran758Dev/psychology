import {
  LayoutDashboard,
  FolderOpen,
  BookOpen,
  Users,
  ShoppingCart,
  Layers3,
  Settings,
} from "lucide-react";

export const adminNavItems = [
  {
    title: "داشبورد",
    href: "admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "دسته‌بندی‌ها",
    href: "/admin/categories",
    icon: Layers3,
  },
  {
    title: "دوره‌ها",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "ثبت‌نام‌ها",
    href: "/admin/enrollments",
    icon: Users,
  },
  {
    title: "سفارش‌ها",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "مدیریت محتوا",
    href: "/admin/contents",
    icon: FolderOpen,
  },
  {
    title: "تنظیمات",
    href: "/admin/settings",
    icon: Settings,
  },
] as const;
