// app/(store)/my/courses/[courseId]/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
  learningService,
  type CourseContentResponse,
} from "@/services/learning.service";
import type { Lesson } from "@/types/lesson";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

function useAuth() {
  return {
    isAuthenticated: true,
    isLoading: false,
  };
}

export default function CourseLearningPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const courseIdParam = params?.courseId;

  const courseId =
    typeof courseIdParam === "string"
      ? courseIdParam
      : Array.isArray(courseIdParam)
        ? courseIdParam[0]
        : undefined;

  // ❗ هوک‌ها باید قبل از هر return باشند
  const queryEnabled = !!courseId && isAuthenticated;

  //   const { data, isLoading, isError, refetch } = useQuery<CourseContentResponse>(
  //     {
  //       queryKey: ["course-content", courseId ?? ""],
  //       enabled: queryEnabled,
  //       queryFn: async () => {
  //         const response = await learningService.getCourseContent(
  //           courseId as string,
  //         );
  //         // learningService.getCourseContent خودش CourseContentResponse برمی‌گرداند،
  //         // پس نیازی به response.data نیست (توضیح پایین‌تر)
  //         return response;
  //       },
  //     },
  //   );
  const { data, isLoading, isError, refetch } = useQuery<CourseContentResponse>(
    {
      queryKey: ["course-content", courseId ?? ""],
      enabled: queryEnabled,
      queryFn: () => learningService.getCourseContent(courseId as string),
    },
  );
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const course = data?.course;
  const lessons = data?.lessons ?? [];

  const selectedLesson: Lesson | undefined = useMemo(() => {
    if (!lessons.length) return undefined;
    const found =
      selectedLessonId != null
        ? lessons.find((l) => l.id === selectedLessonId)
        : lessons[0];
    return found;
  }, [lessons, selectedLessonId]);

  // از اینجا به بعد، فقط JSX را بر اساس stateهای مختلف برمی‌گردانیم

  // 1) auth در حال لود
  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-56 mb-4" />
        <CourseLearningSkeleton />
      </div>
    );
  }

  // 2) کاربر لاگین نیست
  if (!isAuthenticated) {
    // بهتر است push داخل useEffect باشد، ولی برای سادگی فعلاً اینجا:
    router.push("/auth/login");
    return null;
  }

  // 3) courseId نامعتبر
  if (!courseId) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>شناسه دوره نامعتبر است</AlertTitle>
          <AlertDescription>شناسه دوره در آدرس یافت نشد.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // 4) هنوز query در حال لود است
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-56 mb-4" />
        <CourseLearningSkeleton />
      </div>
    );
  }

  // 5) خطا یا نبود course
  if (isError || !data || !course) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>خطا در بارگذاری محتوای دوره</AlertTitle>
          <AlertDescription className="mt-2 flex items-center justify-between gap-4">
            <span>در دریافت اطلاعات دوره مشکلی رخ داد.</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              تلاش مجدد
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 6) حالت نرمال
  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header دوره */}
      <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-vazir">
            {course.title}
          </h1>
          {course.short_description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {course.short_description}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/courses/${course.slug}`)}
        >
          مشاهده صفحه دوره
        </Button>
      </header>

      {/* Layout اصلی یادگیری */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* ستون player / محتوا */}
        <section className="space-y-4">
          <Card className="min-h-[260px] md:min-h-[320px]">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedLesson ? selectedLesson.title : "درس انتخاب نشده"}
              </CardTitle>
              {selectedLesson && (
                <p className="mt-1 text-xs text-muted-foreground">
                  نوع محتوا: {selectedLesson.content_type}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {!selectedLesson ? (
                <p className="text-sm text-muted-foreground">
                  هنوز هیچ درسی برای نمایش انتخاب نشده است.
                </p>
              ) : (
                <LessonPlayer lesson={selectedLesson} />
              )}
            </CardContent>
          </Card>

          {/* توضیحات دوره / محتوا متنی درس */}
          {selectedLesson?.content && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">متن درس</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none prose-p:mb-2 prose-headings:mt-3 prose-headings:mb-2"
                  dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                />
              </CardContent>
            </Card>
          )}
        </section>

        {/* ستون لیست درس‌ها */}
        <aside>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">درس‌های دوره</CardTitle>
            </CardHeader>
            <CardContent>
              {lessons.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  برای این دوره هنوز درسی ثبت نشده است.
                </p>
              ) : (
                <ScrollArea className="max-h-[420px]">
                  <div className="space-y-1">
                    {lessons
                      .slice()
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((lesson) => {
                        const isSelected = lesson.id === selectedLesson?.id;
                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => setSelectedLessonId(lesson.id)}
                            className={[
                              "flex w-full items-center justify-between rounded-md px-3 py-2 text-right text-sm transition",
                              isSelected
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted",
                            ].join(" ")}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {lesson.title}
                              </span>
                              <span className="mt-0.5 text-xs text-muted-foreground">
                                {lesson.duration_minutes
                                  ? `${lesson.duration_minutes} دقیقه`
                                  : "بدون زمان‌بندی"}
                              </span>
                            </div>
                            {lesson.is_free_preview && (
                              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                                پیش‌نمایش
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const { content_type, video_url, audio_url, file_path } = lesson;

  if (content_type === "video" && video_url) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
        <video src={video_url} controls className="h-full w-full" />
      </div>
    );
  }

  if (content_type === "audio" && audio_url) {
    return (
      <div className="space-y-2">
        <audio src={audio_url} controls className="w-full" />
      </div>
    );
  }

  if (content_type === "file" && file_path) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground mb-2">
          فایل این درس قابل دانلود است:
        </p>
        <Button asChild variant="outline" size="sm">
          <a href={file_path} target="_blank" rel="noopener noreferrer">
            دانلود فایل درس
          </a>
        </Button>
      </div>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      برای این درس پلیر اختصاصی وجود ندارد یا آدرس محتوا در دسترس نیست. در صورت
      وجود متن درس، پایین صفحه نمایش داده می‌شود.
    </p>
  );
}

function CourseLearningSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section className="space-y-4">
        <Card className="min-h-[260px] md:min-h-[320px]">
          <CardHeader>
            <Skeleton className="h-5 w-40 mb-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full rounded-md" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </section>
      <aside>
        <Card className="h-full">
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
