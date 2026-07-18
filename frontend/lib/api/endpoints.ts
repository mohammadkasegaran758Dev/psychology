// src/lib/api/endpoints.ts
export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
    logout: "/auth/logout",
  },

  courses: {
    list: "/courses",
    detail: (slug: string) => `/courses/${slug}`,
  },

  categories: {
    list: "/categories",
    detail: (slug: string) => `/categories/${slug}`,
  },

  orders: {
    create: "/orders",
    mine: "/orders/me",
    detail: (id: string | number) => `/orders/${id}`,
  },

  payments: {
    create: "/payments",
    mine: "/payments/me",
    detail: (id: string | number) => `/payments/${id}`,
    verify: "/payments/verify",
  },

  learning: {
    myCourses: "/learning/courses",
    courseContent: (courseId: string | number) =>
      `/learning/courses/${courseId}`,
  },
} as const;
