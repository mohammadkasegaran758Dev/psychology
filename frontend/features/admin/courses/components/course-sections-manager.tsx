"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  File,
  FileText,
  GripVertical,
  Pencil,
  PlayCircle,
  Plus,
  Trash2,
  Video,
  Volume2,
} from "lucide-react";

import {
  useCourseSections,
  useCreateSection,
  useDeleteSection,
  useUpdateSection,
} from "../hooks/use-course-sections";
import {
  useCourseLessons,
  useCreateLesson,
  useDeleteLesson,
  useUpdateLesson,
} from "../hooks/use-course-lessons";
import { useLessonMediaUpload } from "../hooks/use-lesson-media-upload";
import { useReorderLessons } from "../hooks/use-reorder-lessons";
import { useReorderSections } from "../hooks/use-reorder-sections";

import type { Lesson, LessonContentType } from "../types/lesson";
import type { Section } from "../types/section";
import type { SectionFormData } from "../schemas/section-schema";

import { LessonFormDialog } from "./lesson-form-dialog";
import { SectionFormDialog } from "./section-form-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CourseSectionsManagerProps = {
  courseId: number;
};

type LessonDialogSubmitValues = Parameters<
  React.ComponentProps<typeof LessonFormDialog>["onSubmit"]
>[0];

const LESSON_DROPPABLE_PREFIX = "section-lessons-";

function getSectionIdFromDroppableId(droppableId: string): number | null {
  if (!droppableId.startsWith(LESSON_DROPPABLE_PREFIX)) {
    return null;
  }

  const sectionId = Number(droppableId.slice(LESSON_DROPPABLE_PREFIX.length));
  return Number.isInteger(sectionId) ? sectionId : null;
}

function getLessonTypeLabel(contentType: LessonContentType): string {
  switch (contentType) {
    case "video":
      return "ویدیو";
    case "audio":
      return "صوت";
    case "text":
      return "متن";
    case "file":
      return "فایل";
  }
}

function LessonTypeIcon({ contentType }: { contentType: LessonContentType }) {
  switch (contentType) {
    case "video":
      return <Video className="h-4 w-4 text-blue-500" />;
    case "audio":
      return <Volume2 className="h-4 w-4 text-purple-500" />;
    case "text":
      return <FileText className="h-4 w-4 text-emerald-500" />;
    case "file":
      return <File className="h-4 w-4 text-slate-500" />;
  }
}

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

  const reorderSectionsMutation = useReorderSections(courseId);
  const reorderLessonsMutation = useReorderLessons(courseId);

  const { uploadFile, isUploading } = useLessonMediaUpload();

  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);

  const sortedSections = useMemo(() => {
    return [...sections].sort((a, b) => a.sort_order - b.sort_order);
  }, [sections]);

  const lessonsBySection = useMemo(() => {
    const grouped = lessons.reduce<Record<number, Lesson[]>>((acc, lesson) => {
      if (!acc[lesson.section_id]) {
        acc[lesson.section_id] = [];
      }

      acc[lesson.section_id].push(lesson);
      return acc;
    }, {});

    Object.values(grouped).forEach((sectionLessons) => {
      sectionLessons.sort((a, b) => a.sort_order - b.sort_order);
    });

    return grouped;
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
      return;
    }

    await createSectionMutation.mutateAsync(values);
  };

  const handleDeleteSection = async (sectionId: number) => {
    const confirmed = window.confirm(
      "آیا از حذف این سکشن و درس‌های مرتبط با آن مطمئن هستید؟",
    );

    if (!confirmed) {
      return;
    }

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

  const handleLessonSubmit = async (values: LessonDialogSubmitValues) => {
    if (activeSectionId === null) {
      return;
    }

    if (selectedLesson) {
      await updateLessonMutation.mutateAsync({
        lessonId: selectedLesson.id,
        sectionId: activeSectionId,
        payload: values,
      });
      return;
    }

    await createLessonMutation.mutateAsync({
      sectionId: activeSectionId,
      payload: values,
    });
  };

  const handleDeleteLesson = async (lessonId: number) => {
    const confirmed = window.confirm("آیا از حذف این درس مطمئن هستید؟");

    if (!confirmed) {
      return;
    }

    await deleteLessonMutation.mutateAsync(lessonId);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "SECTION") {
      const reorderedSections = [...sortedSections];
      const [movedSection] = reorderedSections.splice(source.index, 1);

      if (!movedSection) {
        return;
      }

      reorderedSections.splice(destination.index, 0, movedSection);

      await reorderSectionsMutation.mutateAsync(
        reorderedSections.map((section) => section.id),
      );
      return;
    }

    if (type !== "LESSON") {
      return;
    }

    const sourceSectionId = getSectionIdFromDroppableId(source.droppableId);
    const destinationSectionId = getSectionIdFromDroppableId(
      destination.droppableId,
    );

    if (sourceSectionId === null || destinationSectionId === null) {
      return;
    }

    if (sourceSectionId !== destinationSectionId) {
      return;
    }

    const reorderedLessons = [...(lessonsBySection[sourceSectionId] ?? [])];
    const [movedLesson] = reorderedLessons.splice(source.index, 1);

    if (!movedLesson) {
      return;
    }

    reorderedLessons.splice(destination.index, 0, movedLesson);

    await reorderLessonsMutation.mutateAsync(
      reorderedLessons.map((lesson) => lesson.id),
    );
  };

  const handleSectionDialogOpenChange = (open: boolean) => {
    setSectionDialogOpen(open);

    if (!open) {
      setSelectedSection(null);
    }
  };

  const handleLessonDialogOpenChange = (open: boolean) => {
    setLessonDialogOpen(open);

    if (!open) {
      setSelectedLesson(null);
      setActiveSectionId(null);
    }
  };

  const isLoading = isSectionsLoading || isLessonsLoading;
  const isReordering =
    reorderSectionsMutation.isPending || reorderLessonsMutation.isPending;

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>ساختار آموزشی دوره</CardTitle>
          <Button type="button" onClick={handleCreateSectionClick}>
            <Plus className="ml-2 h-4 w-4" />
            افزودن سکشن
          </Button>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              در حال بارگذاری ساختار دوره...
            </div>
          ) : sortedSections.length === 0 ? (
            <div className="space-y-4 rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">
                هنوز هیچ سکشنی برای این دوره ثبت نشده است.
              </p>
              {/* <Button type="button" onClick={handleCreateSectionClick}>
                <Plus className="ml-2 h-4 w-4" />
                ایجاد اولین سکشن
              </Button> */}
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="course-sections" type="SECTION">
                {(sectionsDroppable) => (
                  <div
                    ref={sectionsDroppable.innerRef}
                    {...sectionsDroppable.droppableProps}
                    className="space-y-4"
                  >
                    {sortedSections.map((section, sectionIndex) => {
                      const sectionLessons = lessonsBySection[section.id] ?? [];

                      return (
                        <Draggable
                          key={section.id}
                          draggableId={`section-${section.id}`}
                          index={sectionIndex}
                          isDragDisabled={isReordering}
                        >
                          {(sectionDraggable, sectionSnapshot) => (
                            <div
                              ref={sectionDraggable.innerRef}
                              {...sectionDraggable.draggableProps}
                              className={[
                                "overflow-hidden rounded-xl border bg-card transition-shadow",
                                sectionSnapshot.isDragging
                                  ? "shadow-lg ring-2 ring-primary/20"
                                  : "",
                              ].join(" ")}
                            >
                              <div className="flex flex-col gap-3 border-b bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 items-center gap-3">
                                  <button
                                    type="button"
                                    {...sectionDraggable.dragHandleProps}
                                    className="shrink-0 cursor-grab rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
                                  >
                                    <GripVertical className="h-5 w-5" />
                                  </button>

                                  <div className="min-w-0">
                                    <h3 className="truncate font-semibold">
                                      {section.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      ترتیب: {section.sort_order} | تعداد
                                      درس‌ها: {sectionLessons.length}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleCreateLessonClick(section.id)
                                    }
                                  >
                                    <Plus className="ml-2 h-4 w-4" />
                                    افزودن درس
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleEditSectionClick(section)
                                    }
                                  >
                                    <Pencil className="ml-2 h-4 w-4" />
                                    ویرایش
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteSection(section.id)
                                    }
                                  >
                                    <Trash2 className="ml-2 h-4 w-4" />
                                    حذف
                                  </Button>
                                </div>
                              </div>

                              <Droppable
                                droppableId={`${LESSON_DROPPABLE_PREFIX}${section.id}`}
                                type="LESSON"
                              >
                                {(lessonsDroppable) => (
                                  <div
                                    ref={lessonsDroppable.innerRef}
                                    {...lessonsDroppable.droppableProps}
                                    className="min-h-20 space-y-3 p-3"
                                  >
                                    {sectionLessons.length === 0 ? (
                                      <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                                        برای این سکشن هنوز درسی ثبت نشده است.
                                      </div>
                                    ) : (
                                      sectionLessons.map(
                                        (lesson, lessonIndex) => (
                                          <Draggable
                                            key={lesson.id}
                                            draggableId={`lesson-${lesson.id}`}
                                            index={lessonIndex}
                                            isDragDisabled={isReordering}
                                          >
                                            {(
                                              lessonDraggable,
                                              lessonSnapshot,
                                            ) => (
                                              <div
                                                ref={lessonDraggable.innerRef}
                                                {...lessonDraggable.draggableProps}
                                                className={[
                                                  "flex flex-col gap-3 rounded-lg border bg-background p-3 transition sm:flex-row sm:items-center sm:justify-between",
                                                  lessonSnapshot.isDragging
                                                    ? "shadow-md ring-2 ring-primary/20"
                                                    : "hover:bg-muted/20",
                                                ].join(" ")}
                                              >
                                                <div className="flex min-w-0 items-center gap-3">
                                                  <button
                                                    type="button"
                                                    {...lessonDraggable.dragHandleProps}
                                                    className="shrink-0 cursor-grab rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
                                                  >
                                                    <GripVertical className="h-4 w-4" />
                                                  </button>

                                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                                                    <LessonTypeIcon
                                                      contentType={
                                                        lesson.content_type
                                                      }
                                                    />
                                                  </div>

                                                  <div className="min-w-0 space-y-1">
                                                    <div className="truncate font-medium">
                                                      {lesson.title}
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                                      <span>
                                                        نوع:{" "}
                                                        {getLessonTypeLabel(
                                                          lesson.content_type,
                                                        )}
                                                      </span>
                                                      <span aria-hidden="true">
                                                        •
                                                      </span>
                                                      <span>
                                                        ترتیب:{" "}
                                                        {lesson.sort_order}
                                                      </span>

                                                      {lesson.duration_minutes !==
                                                        null && (
                                                        <>
                                                          <span aria-hidden="true">
                                                            •
                                                          </span>
                                                          <span>
                                                            مدت:{" "}
                                                            {
                                                              lesson.duration_minutes
                                                            }{" "}
                                                            دقیقه
                                                          </span>
                                                        </>
                                                      )}

                                                      {lesson.is_free_preview && (
                                                        <>
                                                          <span aria-hidden="true">
                                                            •
                                                          </span>
                                                          <span className="inline-flex items-center gap-1 text-emerald-600">
                                                            <PlayCircle className="h-3 w-3" />
                                                            پیش‌نمایش رایگان
                                                          </span>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t pt-3 sm:border-t-0 sm:pt-0">
                                                  <span
                                                    className={[
                                                      "rounded-full px-2 py-1 text-xs",
                                                      lesson.is_published
                                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
                                                    ].join(" ")}
                                                  >
                                                    {lesson.is_published
                                                      ? "منتشرشده"
                                                      : "پیش‌نویس"}
                                                  </span>

                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleEditLessonClick(
                                                        lesson,
                                                      )
                                                    }
                                                  >
                                                    <Pencil className="ml-2 h-4 w-4" />
                                                    ویرایش
                                                  </Button>

                                                  <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleDeleteLesson(
                                                        lesson.id,
                                                      )
                                                    }
                                                  >
                                                    <Trash2 className="ml-2 h-4 w-4" />
                                                    حذف
                                                  </Button>
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ),
                                      )
                                    )}

                                    {lessonsDroppable.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}

                    {sectionsDroppable.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      <SectionFormDialog
        open={sectionDialogOpen}
        onOpenChange={handleSectionDialogOpenChange}
        initialData={selectedSection}
        onSubmit={handleSectionSubmit}
        isSubmitting={
          createSectionMutation.isPending || updateSectionMutation.isPending
        }
      />

      <LessonFormDialog
        open={lessonDialogOpen}
        onOpenChange={handleLessonDialogOpenChange}
        sectionId={activeSectionId ?? 0}
        lesson={selectedLesson}
        uploadFile={uploadFile}
        onSubmit={handleLessonSubmit}
        isSubmitting={
          createLessonMutation.isPending ||
          updateLessonMutation.isPending ||
          isUploading
        }
      />
    </>
  );
}
