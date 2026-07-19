// src/app/(store)/courses/page.tsx
"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { courseService } from "@/services/course.service";
import type { Course, PaginatedResponse } from "@/types/course";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CourseCard } from "@/app/(store)/courses/course-card";

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string>("");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch, isFetching } = useQuery<
    AxiosResponse<PaginatedResponse<Course>>
  >({
    queryKey: ["courses", page, categoryId, search],
    queryFn: () =>
      courseService.getCourses({
        page,
        category_id: categoryId || undefined,
        search: search || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const paginated: PaginatedResponse<Course> | undefined = data?.data;
  const courses: Course[] = paginated?.data ?? [];
  const meta = paginated?.meta;

  return (
    <div className="container mx-auto p-6">
      {/* Header + Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-vazir text-2xl font-bold">دوره‌های آموزشی</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            بین دوره‌ها جستجو کنید و دوره مناسب خود را انتخاب کنید.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <Input
            placeholder="جستجو در عنوان دوره..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="md:w-64"
          />

          <Select
            value={categoryId}
            onValueChange={(value) => {
              setPage(1);
              setCategoryId(value);
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="همه دسته‌ها" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">همه دسته‌ها</SelectItem>
              {/* TODO: دسته‌ها را از API بگیر */}
              <SelectItem value="1">روانشناسی</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* States */}
      {isLoading && !data ? (
        <CoursesSkeletonGrid />
      ) : isError ? (
        <div className="py-12">
          <Alert variant="destructive">
            <AlertTitle>خطا در بارگذاری دوره‌ها</AlertTitle>
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
          <p className="text-lg text-muted-foreground">هیچ دوره‌ای یافت نشد.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{meta?.total ?? 0} دوره یافت شد</span>
            {isFetching && <span>در حال به‌روزرسانی...</span>}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="mt-8 flex justify-center gap-2" dir="ltr">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                قبلی
              </Button>
              <span className="flex items-center px-4 text-sm">
                صفحه {meta.current_page} از {meta.last_page}
              </span>
              <Button
                variant="outline"
                disabled={page === meta.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                بعدی
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CoursesSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex h-[350px] flex-col justify-between">
          <CardHeader>
            <Skeleton className="h-48 w-full rounded-md" />
            <Skeleton className="mt-4 h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
