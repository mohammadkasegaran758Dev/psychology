// app/(store)/my/courses/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { learningService } from "@/services/learning.service";
import type { Course } from "@/types/course";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// TODO: این را با سیستم auth خودت جایگزین کن
// اگر از next-auth استفاده می‌کنی، می‌تواند useSession باشد
function useAuth() {
  // placeholder ساده: فرض کنیم همیشه لاگین است
  // این را بعداً با واقعی جایگزین کن
  return {
    isAuthenticated: true,
    isLoading: false,
  };
}

export default function MyCoursesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-courses"],
    queryFn: async () => {
      const response = await learningService.getMyCourses();
      // طبق repomix-output.xml: getMyCourses برمی‌گرداند Course[]
      return response as Course[];
    },
  });

  // Guard: اگر auth در حال لود است، صبر کن
  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-40 mb-4" />
        <MyCoursesSkeletonGrid />
      </div>
    );
  }

  // اگر لاگین نیست: هدایت به صفحه ورود (یا هر صفحه‌ای که داری)
  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  const courses = data ?? [];

  return (
    <div className="container mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold font-vazir">دوره‌های من</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          در این بخش می‌توانید به دوره‌هایی که ثبت‌نام کرده‌اید دسترسی پیدا
          کنید.
        </p>
      </header>

      {isLoading ? (
        <MyCoursesSkeletonGrid />
      ) : isError ? (
        <div className="py-12">
          <Alert variant="destructive">
            <AlertTitle>خطا در بارگذاری دوره‌ها</AlertTitle>
            <AlertDescription className="mt-2 flex items-center justify-between gap-4">
              <span>مشکلی در دریافت لیست دوره‌های شما رخ داد.</span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                تلاش مجدد
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      ) : courses.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید.
          </p>
          <div className="mt-4">
            <Link href="/courses">
              <Button>مشاهده دوره‌های موجود</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <MyCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

function MyCourseCard({ course }: { course: Course }) {
  const finalPrice = Number(course.final_price ?? course.price ?? 0);
  const isFree = course.is_free || finalPrice <= 0;

  return (
    <Card className="flex flex-col justify-between overflow-hidden">
      <CardHeader className="relative h-40 p-0">
        <img
          src={course.cover_image || "/placeholder-course.jpg"}
          alt={course.title}
          className="h-full w-full object-cover"
        />
        {course.category?.title && (
          <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
            {course.category.title}
          </span>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 line-clamp-1 text-lg">
          {course.title}
        </CardTitle>
        {course.short_description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {course.short_description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <span className="text-xs text-muted-foreground">
          {isFree ? "دوره رایگان" : "دوره خریداری‌شده"}
        </span>
        {/* مهم: استفاده از course.id برای صفحه یادگیری */}
        <Link href={`/my/courses/${course.id}`}>
          <Button size="sm">ادامه یادگیری</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function MyCoursesSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex h-[260px] flex-col justify-between">
          <CardHeader>
            <Skeleton className="h-32 w-full rounded-md" />
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
