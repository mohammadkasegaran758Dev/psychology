// src/lib/constants/routes.ts
export const routes = {
  home: "/",
  courses: "/courses",
  categories: "/categories",
  search: "/search",

  login: "/login",
  register: "/register",
  checkout: "/checkout",
  paymentResult: "/payment/result",

  my: "/my",
  myCourses: "/my/courses",
  myOrders: "/my/orders",
  myPayments: "/my/payments",
} as const;

export const routeBuilders = {
  courseDetails: (slug: string) => `/courses/${slug}`,
  categoryDetails: (slug: string) => `/categories/${slug}`,
  myCourseContent: (courseId: string | number) => `/my/courses/${courseId}`,
} as const;
