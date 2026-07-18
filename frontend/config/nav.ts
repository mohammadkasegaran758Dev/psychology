// src/config/nav.ts
import { routes } from "@/lib/constants/routes";

export const mainNav = [
  { title: "خانه", href: routes.home },
  { title: "دوره ها", href: routes.courses },
  { title: "جستجو", href: routes.search },
] as const;

export const userNav = [
  { title: "دوره های من", href: routes.myCourses },
  { title: "سفارش های من", href: routes.myOrders },
  { title: "پرداخت های من", href: routes.myPayments },
] as const;
