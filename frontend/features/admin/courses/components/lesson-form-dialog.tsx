"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { lessonSchema, type LessonFormValues } from "../schemas/lesson-schema";
import { normalizeLessonPayload } from "../utils/normalize-lesson-payload";
import { LessonMediaUploader } from "./lesson-media-uploader";
import type { Lesson } from "../types/lesson";

type LessonFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: number;
  lesson?: Lesson | null;
  isSubmitting?: boolean;
  onSubmit: (
    values: ReturnType<typeof normalizeLessonPayload>,
  ) => Promise<void>;
  uploadFile?: (
    file: File,
    type: "video" | "audio" | "file",
  ) => Promise<string>;
};

export function LessonFormDialog({
  open,
  onOpenChange,
  sectionId,
  lesson,
  isSubmitting,
  onSubmit,
  uploadFile,
}: LessonFormDialogProps) {
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      section_id: sectionId,
      title: lesson?.title ?? "",
      slug: lesson?.slug ?? "",
      description: lesson?.description ?? "",
      content_type: lesson?.content_type ?? "video",
      content: lesson?.content ?? "",
      video_url: lesson?.video_url ?? "",
      audio_url: lesson?.audio_url ?? "",
      file_path: lesson?.file_path ?? "",
      duration_minutes: lesson?.duration_minutes ?? undefined,
      is_free_preview: lesson?.is_free_preview ?? false,
      sort_order: lesson?.sort_order ?? 0,
      is_published: lesson?.is_published ?? true,
    },
  });

  const contentType = form.watch("content_type");

  useEffect(() => {
    form.setValue("section_id", sectionId);

    if (!open) return;

    form.reset({
      section_id: sectionId,
      title: lesson?.title ?? "",
      slug: lesson?.slug ?? "",
      description: lesson?.description ?? "",
      content_type: lesson?.content_type ?? "video",
      content: lesson?.content ?? "",
      video_url: lesson?.video_url ?? "",
      audio_url: lesson?.audio_url ?? "",
      file_path: lesson?.file_path ?? "",
      duration_minutes: lesson?.duration_minutes ?? undefined,
      is_free_preview: lesson?.is_free_preview ?? false,
      sort_order: lesson?.sort_order ?? 0,
      is_published: lesson?.is_published ?? true,
    });
  }, [lesson, open, sectionId, form]);

  useEffect(() => {
    if (contentType === "text") {
      form.setValue("video_url", "");
      form.setValue("audio_url", "");
      form.setValue("file_path", "");
    }

    if (contentType === "video") {
      form.setValue("audio_url", "");
      form.setValue("file_path", "");
      form.setValue("content", "");
    }

    if (contentType === "audio") {
      form.setValue("video_url", "");
      form.setValue("file_path", "");
      form.setValue("content", "");
    }

    if (contentType === "file") {
      form.setValue("video_url", "");
      form.setValue("audio_url", "");
      form.setValue("content", "");
    }
  }, [contentType, form]);

  const submitHandler = form.handleSubmit(async (values) => {
    await onSubmit(normalizeLessonPayload(values));
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lesson ? "ویرایش درس" : "افزودن درس جدید"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان درس</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثلاً: معرفی درمان CBT" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع محتوا</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="نوع محتوا را انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="video">ویدیو</SelectItem>
                        <SelectItem value="audio">صوت</SelectItem>
                        <SelectItem value="text">متنی</SelectItem>
                        <SelectItem value="file">فایل</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسلاگ</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مدت (دقیقه)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات کوتاه</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      rows={3}
                      placeholder="توضیح کوتاه درباره محتوای این درس"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {contentType === "text" ? (
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>متن درس</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        rows={10}
                        placeholder="متن درس را وارد کنید"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            {contentType === "video" ? (
              <FormField
                control={form.control}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>فایل یا آدرس ویدیو</FormLabel>
                    <FormControl>
                      <LessonMediaUploader
                        value={field.value}
                        onChange={field.onChange}
                        accept="video/*"
                        label="آپلود ویدیو"
                        placeholder="https://... یا مسیر فایل آپلودشده"
                        uploadFile={
                          uploadFile
                            ? (file) => uploadFile(file, "video")
                            : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            {contentType === "audio" ? (
              <FormField
                control={form.control}
                name="audio_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>فایل یا آدرس صوت</FormLabel>
                    <FormControl>
                      <LessonMediaUploader
                        value={field.value}
                        onChange={field.onChange}
                        accept="audio/*"
                        label="آپلود فایل صوتی"
                        placeholder="https://... یا مسیر فایل آپلودشده"
                        uploadFile={
                          uploadFile
                            ? (file) => uploadFile(file, "audio")
                            : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            {contentType === "file" ? (
              <FormField
                control={form.control}
                name="file_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>فایل ضمیمه</FormLabel>
                    <FormControl>
                      <LessonMediaUploader
                        value={field.value}
                        onChange={field.onChange}
                        accept=".pdf,.zip,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        label="آپلود فایل"
                        placeholder="مسیر فایل آپلودشده"
                        uploadFile={
                          uploadFile
                            ? (file) => uploadFile(file, "file")
                            : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ترتیب نمایش</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value ?? 0}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value || 0))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_free_preview"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border p-3">
                    <div className="space-y-1">
                      <FormLabel>پیش‌نمایش رایگان</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border p-3">
                    <div className="space-y-1">
                      <FormLabel>منتشر شده</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                انصراف
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {lesson ? "ذخیره تغییرات" : "ایجاد درس"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
