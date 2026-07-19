// src/app/(store)/categories/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/course.service";
import type { Course, PaginatedResponse } from "@/types/course";
import { CourseCard } from "@/app/(store)/courses/course-card"; // اگر export کردی
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, isError, refetch } = useQuery<
    PaginatedResponse<Course>
  >({
    queryKey: ["category-courses", slug],
    queryFn: async () => {
      // اسم پارامتر را مطابق backend تنظیم کن
      const response = await courseService.getCourses({
        category_id: slug,
      });
      return response.data;
    },
    enabled: !!slug,
  });

  const courses = data?.data ?? [];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">دوره‌های دسته‌بندی</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          نمایش دوره‌های مرتبط با این دسته‌بندی.
        </p>
      </div>

      {isLoading && !data ? (
        <CategorySkeletonGrid />
      ) : isError ? (
        <div className="py-12">
          <Alert variant="destructive">
            <AlertTitle>خطا در بارگذاری دوره‌های دسته‌بندی</AlertTitle>
            <AlertDescription className="mt-2 flex items-center justify-between gap-4">
              <span>مشکلی در دریافت لیست دوره‌ها رخ داد.</span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                تلاش مجدد
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      ) : courses.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            هیچ دوره‌ای برای این دسته‌بندی ثبت نشده است.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategorySkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[350px] w-full rounded-md" />
      ))}
    </div>
  );
}
