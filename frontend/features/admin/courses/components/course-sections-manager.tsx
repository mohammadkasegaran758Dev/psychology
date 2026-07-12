"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import {
  useCourseSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
} from "../hooks/use-course-sections";
import {
  useCourseLessons,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from "../hooks/use-course-lessons";

import type { Section } from "../types/section";
import type { Lesson } from "../types/lesson";
import type { SectionFormData } from "../schemas/section-schema";
import type { LessonFormValues } from "../schemas/lesson-schema";

import { SectionFormDialog } from "./section-form-dialog";
import { LessonFormDialog } from "./lesson-form-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLessonMediaUpload } from "../hooks/use-lesson-media-upload";

type CourseSectionsManagerProps = {
  courseId: number;
};

export function CourseSectionsManager({
  courseId,
}: CourseSectionsManagerProps) {
  const { data: sections = [], isLoading: isSectionsLoading } =
    useCourseSections(courseId);

  const { data: lessons = [], isLoading: isLessonsLoading } =
    useCourseLessons(courseId);

  const createSectionMutation = useCreateSection(courseId);
  const updateSectionMutation = useUpdateSection(courseId);
  const deleteSectionMutation = useDeleteSection(courseId);

  const createLessonMutation = useCreateLesson(courseId);
  const updateLessonMutation = useUpdateLesson(courseId);
  const deleteLessonMutation = useDeleteLesson(courseId);

  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);

  const lessonsBySection = useMemo(() => {
    return lessons.reduce<Record<number, Lesson[]>>((acc, lesson) => {
      if (!acc[lesson.section_id]) {
        acc[lesson.section_id] = [];
      }
      acc[lesson.section_id].push(lesson);
      return acc;
    }, {});
  }, [lessons]);

  const handleCreateSectionClick = () => {
    setSelectedSection(null);
    setSectionDialogOpen(true);
  };

  const handleEditSectionClick = (section: Section) => {
    setSelectedSection(section);
    setSectionDialogOpen(true);
  };

  const handleSectionSubmit = async (values: SectionFormData) => {
    if (selectedSection) {
      await updateSectionMutation.mutateAsync({
        sectionId: selectedSection.id,
        payload: values,
      });
    } else {
      await createSectionMutation.mutateAsync(values);
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    const confirmed = window.confirm("آیا از حذف این سکشن مطمئن هستید؟");

    if (!confirmed) return;

    await deleteSectionMutation.mutateAsync(sectionId);
  };

  const handleCreateLessonClick = (sectionId: number) => {
    setSelectedLesson(null);
    setActiveSectionId(sectionId);
    setLessonDialogOpen(true);
  };

  const handleEditLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveSectionId(lesson.section_id);
    setLessonDialogOpen(true);
  };

  const handleLessonSubmit = async (values: LessonFormValues) => {
    if (!activeSectionId) return;

    if (selectedLesson) {
      await updateLessonMutation.mutateAsync({
        lessonId: selectedLesson.id,
        sectionId: activeSectionId,
        payload: values,
      });
    } else {
      await createLessonMutation.mutateAsync({
        sectionId: activeSectionId,
        payload: values,
      });
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    const confirmed = window.confirm("آیا از حذف این درس مطمئن هستید؟");

    if (!confirmed) return;

    await deleteLessonMutation.mutateAsync(lessonId);
  };

  const isLoading = isSectionsLoading || isLessonsLoading;
  const { uploadFile, isUploading } = useLessonMediaUpload();

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>ساختار آموزشی دوره</CardTitle>

          <Button onClick={handleCreateSectionClick}>افزودن سکشن</Button>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">
              در حال بارگذاری ساختار دوره...
            </div>
          ) : sections.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                هنوز هیچ سکشنی برای این دوره ثبت نشده است.
              </p>
              <Button onClick={handleCreateSectionClick}>
                ایجاد اولین سکشن
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section) => {
                const sectionLessons = lessonsBySection[section.id] ?? [];

                return (
                  <div
                    key={section.id}
                    className="rounded-xl border p-4 space-y-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          ترتیب نمایش: {section.sort_order}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleCreateLessonClick(section.id)}
                        >
                          افزودن درس
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleEditSectionClick(section)}
                        >
                          ویرایش سکشن
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteSection(section.id)}
                          disabled={deleteSectionMutation.isPending}
                        >
                          حذف سکشن
                        </Button>
                      </div>
                    </div>

                    {sectionLessons.length === 0 ? (
                      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                        برای این سکشن هنوز درسی ثبت نشده است.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {sectionLessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="space-y-1">
                              <div className="font-medium">{lesson.title}</div>
                              <div className="text-sm text-muted-foreground">
                                نوع محتوا: {lesson.content_type} | ترتیب:{" "}
                                {lesson.sort_order}
                                {lesson.duration_minutes
                                  ? ` | مدت: ${lesson.duration_minutes} دقیقه`
                                  : ""}
                                {lesson.is_free_preview
                                  ? " | پیش‌نمایش رایگان"
                                  : ""}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                onClick={() => handleEditLessonClick(lesson)}
                              >
                                ویرایش
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteLesson(lesson.id)}
                                disabled={deleteLessonMutation.isPending}
                              >
                                حذف
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <SectionFormDialog
        open={sectionDialogOpen}
        onOpenChange={setSectionDialogOpen}
        initialData={selectedSection}
        onSubmit={handleSectionSubmit}
        isSubmitting={
          createSectionMutation.isPending || updateSectionMutation.isPending
        }
      />

      {/* <LessonFormDialog
        open={lessonDialogOpen}
        onOpenChange={setLessonDialogOpen}
        sectionId={activeSectionId}
        lesson={editingLesson}
        isSubmitting={
          createLesson.isPending || updateLesson.isPending || isUploading
        }
        uploadFile={uploadFile}
        onSubmit={async (values) => {
          if (editingLesson) {
            await updateLesson.mutateAsync({
              id: editingLesson.id,
              values,
            });
          } else {
            await createLesson.mutateAsync(values);
          }
        }}
      /> */}

      <LessonFormDialog
        open={lessonDialogOpen}
        onOpenChange={setLessonDialogOpen}
        sectionId={activeSectionId ?? 0}
        lesson={selectedLesson}
        isSubmitting={
          createLessonMutation.isPending ||
          updateLessonMutation.isPending ||
          isUploading
        }
        uploadFile={uploadFile}
        onSubmit={async (values) => {
          if (selectedLesson) {
            await updateLessonMutation.mutateAsync({
              lessonId: selectedLesson.id,
              sectionId: activeSectionId!,
              payload: values,
            });
          } else {
            await createLessonMutation.mutateAsync({
              sectionId: activeSectionId!,
              payload: values,
            });
          }
        }}
      />
    </>
  );
}
