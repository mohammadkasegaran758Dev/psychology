// src/lib/constants/query-keys.ts
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },

  courses: {
    all: ["courses"] as const,
    lists: () => [...queryKeys.courses.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.courses.lists(), params ?? {}] as const,
    details: () => [...queryKeys.courses.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.courses.details(), slug] as const,
  },

  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.categories.lists(), params ?? {}] as const,
    detail: (slug: string) =>
      [...queryKeys.categories.all, "detail", slug] as const,
  },

  orders: {
    all: ["orders"] as const,
    mine: ["orders", "mine"] as const,
    detail: (id: string | number) => ["orders", "detail", id] as const,
  },

  payments: {
    all: ["payments"] as const,
    mine: ["payments", "mine"] as const,
    detail: (id: string | number) => ["payments", "detail", id] as const,
    verify: (authority?: string) =>
      ["payments", "verify", authority ?? "unknown"] as const,
  },

  learning: {
    myCourses: ["learning", "my-courses"] as const,
    courseContent: (courseId: string | number) =>
      ["learning", "course-content", courseId] as const,
  },

  admin: {
    auth: {
      me: ["admin", "auth", "me"] as const,
    },
    courses: {
      all: ["admin", "courses"] as const,
      lists: () => [...queryKeys.admin.courses.all, "list"] as const,
      list: (params?: Record<string, unknown>) =>
        [...queryKeys.admin.courses.lists(), params ?? {}] as const,
      detail: (id: string | number) =>
        [...queryKeys.admin.courses.all, "detail", id] as const,
    },
    lessons: {
      all: ["admin", "lessons"] as const,
      byCourse: (courseId: string | number) =>
        [...queryKeys.admin.lessons.all, "course", courseId] as const,
      detail: (id: string | number) =>
        [...queryKeys.admin.lessons.all, "detail", id] as const,
    },
    sections: {
      all: ["admin", "sections"] as const,
      byCourse: (courseId: string | number) =>
        [...queryKeys.admin.sections.all, "course", courseId] as const,
    },
    categories: {
      all: ["admin", "categories"] as const,
      lists: () => [...queryKeys.admin.categories.all, "list"] as const,
      list: (params?: Record<string, unknown>) =>
        [...queryKeys.admin.categories.lists(), params ?? {}] as const,
      detail: (id: string | number) =>
        [...queryKeys.admin.categories.all, "detail", id] as const,
    },
    orders: {
      all: ["admin", "orders"] as const,
      lists: () => [...queryKeys.admin.orders.all, "list"] as const,
      list: (params?: Record<string, unknown>) =>
        [...queryKeys.admin.orders.lists(), params ?? {}] as const,
      detail: (id: string | number) =>
        [...queryKeys.admin.orders.all, "detail", id] as const,
    },
  },
} as const;
