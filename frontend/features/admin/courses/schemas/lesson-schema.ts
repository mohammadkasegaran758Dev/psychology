import { z } from "zod";

export const lessonContentTypes = ["video", "audio", "text", "file"] as const;

export const lessonSchema = z
  .object({
    section_id: z.number().int().positive("سکشن نامعتبر است"),
    title: z.string().trim().min(1, "عنوان درس الزامی است"),
    slug: z
      .string()
      .trim()
      .max(200, "اسلاگ نباید بیشتر از ۲۰۰ کاراکتر باشد")
      .optional()
      .or(z.literal("")),
    description: z
      .string()
      .trim()
      .max(2000, "توضیحات نباید بیشتر از ۲۰۰۰ کاراکتر باشد")
      .optional()
      .or(z.literal("")),
    content_type: z.enum(lessonContentTypes, {
      message: "نوع محتوا نامعتبر است",
    }),
    content: z.string().optional().nullable(),
    video_url: z.string().optional().nullable(),
    audio_url: z.string().optional().nullable(),
    file_path: z.string().optional().nullable(),
    duration_minutes: z.union([z.number().int().min(0), z.nan()]).optional(),
    is_free_preview: z.boolean(),
    sort_order: z.number().int().min(0),
    is_published: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.content_type === "text") {
      if (!values.content?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["content"],
          message: "متن درس الزامی است",
        });
      }
    }

    if (values.content_type === "video") {
      if (!values.video_url?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["video_url"],
          message: "آپلود یا آدرس ویدیو الزامی است",
        });
      }
    }

    if (values.content_type === "audio") {
      if (!values.audio_url?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["audio_url"],
          message: "آپلود یا آدرس فایل صوتی الزامی است",
        });
      }
    }

    if (values.content_type === "file") {
      if (!values.file_path?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["file_path"],
          message: "آپلود فایل الزامی است",
        });
      }
    }
  });

export type LessonFormValues = z.infer<typeof lessonSchema>;
