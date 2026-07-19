// src/app/(store)/courses/[slug]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { courseService } from "@/services/course.service";
import { orderService } from "@/services/order.service";
import type { CourseDetailsResponse } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlayCircle, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CourseDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CourseDetailsResponse>({
    queryKey: ["course", slug],
    queryFn: async () => {
      const response = await courseService.getCourseBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!course) throw new Error("Course not loaded");

      // اگر برای دوره رایگان قرار است endpoint دیگری فراخوانی شود،
      // اینجا یک شرط isFree اضافه کن.
      return orderService.createOrder({
        course_ids: [course.id],
      });
    },
    onSuccess: (data) => {
      // TODO: این را با ساختار checkout هماهنگ کن (احتمالاً /checkout/[id])
      router.push(`/checkout/${data.id}`);
    },
  });

  const handleEnroll = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }

    createOrderMutation.mutate();
  };

  if (isLoading && !course) {
    return <CourseDetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>خطا در بارگذاری دوره</AlertTitle>
          <AlertDescription className="mt-2 flex items-center justify-between gap-4">
            <span>در دریافت اطلاعات این دوره مشکلی پیش آمد.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              تلاش مجدد
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6 text-center">
        دوره مورد نظر یافت نشد.
      </div>
    );
  }

  const finalPrice = Number(course.final_price ?? course.price ?? 0);
  const isFree = course.is_free || finalPrice <= 0;

  return (
    <div className="container mx-auto grid grid-cols-1 gap-8 p-6 lg:grid-cols-3">
      {/* محتوا */}
      <div className="space-y-6 lg:col-span-2">
        <h1 className="text-3xl font-bold">{course.title}</h1>

        <p className="leading-relaxed text-muted-foreground">
          {course.short_description}
        </p>

        {course.description && (
          <div className="prose max-w-none dark:prose-invert">
            {/* اگر از backend HTML می‌گیری، این را به dangerouslySetInnerHTML تغییر بده */}
            {course.description}
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold">سرفصل‌های دوره</h2>

          {course.sections?.length ? (
            <Accordion
              type="single"
              collapsible
              className="w-full rounded-md border bg-card"
            >
              {course.sections.map((section, idx) => (
                <AccordionItem
                  key={section.id}
                  value={`section-${section.id}`}
                  className="border-b last:border-b-0"
                >
                  <AccordionTrigger className="px-4 py-3 text-right">
                    <span className="font-medium">
                      {idx + 1}. {section.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-1 py-2">
                    {section.lessons?.map((lesson) => (
                      <LessonRow
                        key={lesson.id}
                        lesson={lesson}
                        onClickPreview={() =>
                          handleLessonPreview(course, lesson, router)
                        }
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground">
              برای این دوره هنوز سرفصلی ثبت نشده است.
            </p>
          )}
        </div>
      </div>

      {/* سایدبار قیمت و ثبت‌نام */}
      <div>
        <Card className="sticky top-6">
          <CardContent className="space-y-6 p-6">
            <div className="overflow-hidden rounded-md">
              <img
                src={course.cover_image || "/placeholder-course.jpg"}
                alt={course.title}
                className="h-52 w-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">قیمت دوره:</span>
              <div className="text-2xl font-bold">
                {isFree ? "رایگان" : `${finalPrice.toLocaleString()} تومان`}
              </div>
            </div>

            <Button
              className="w-full py-6 text-lg"
              onClick={handleEnroll}
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending
                ? "در حال پردازش..."
                : isFree
                  ? "دریافت رایگان دوره"
                  : "ثبت‌نام و شروع دوره"}
            </Button>

            {/* <ul className="space-y-2 text-sm text-muted-foreground">
              {course.section_count && (
                <li>تعداد فصل‌ها: {course.section_count}</li>
              )}
              {course.lesson_count && (
                <li>تعداد درس‌ها: {course.lesson_count}</li>
              )}
              {course.duration_minutes && (
                <li>مدت زمان کل: {course.duration_minutes} دقیقه</li>
              )}
            </ul> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CourseDetailsSkeleton() {
  return (
    <div className="container mx-auto grid grid-cols-1 gap-8 p-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div>
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-52 w-full rounded-md" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// TODO: Lesson را از "@/types/lesson" ایمپورت کن
type Lesson = {
  id: number;
  title: string;
  duration_minutes?: number | null;
  is_free_preview?: boolean;
  // سایر فیلدها ....
};

function LessonRow({
  lesson,
  onClickPreview,
}: {
  lesson: Lesson;
  onClickPreview?: () => void;
}) {
  const isPreview = !!lesson.is_free_preview;

  return (
    <button
      type="button"
      onClick={isPreview ? onClickPreview : undefined}
      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-right text-sm transition-colors hover:bg-muted/60"
    >
      <div className="flex items-center gap-2">
        {isPreview ? (
          <PlayCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Lock className="h-4 w-4 text-muted-foreground" />
        )}
        <span>{lesson.title}</span>
      </div>

      <span className="text-xs text-muted-foreground">
        {lesson.duration_minutes ?? "-"} دقیقه
      </span>
    </button>
  );
}

function handleLessonPreview(
  course: CourseDetailsResponse,
  lesson: Lesson,
  router: ReturnType<typeof useRouter>,
) {
  // این جا فقط اسکلت را می‌گذاریم؛ در گام بعدی route پخش درس را تعریف می‌کنیم.
  // مثال پیشنهادی:
  // router.push(`/courses/${course.slug}/lessons/${lesson.id}`);
}
