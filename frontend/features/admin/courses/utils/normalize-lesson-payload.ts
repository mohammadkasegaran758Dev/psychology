import type { LessonFormValues } from "../schemas/lesson-schema";

export function normalizeLessonPayload(values: LessonFormValues) {
  const payload = {
    section_id: values.section_id,
    title: values.title.trim(),
    slug: values.slug?.trim() || null,
    description: values.description?.trim() || null,
    content_type: values.content_type,
    content: values.content?.trim() || null,
    video_url: values.video_url?.trim() || null,
    audio_url: values.audio_url?.trim() || null,
    file_path: values.file_path?.trim() || null,
    duration_minutes:
      typeof values.duration_minutes === "number" &&
      !Number.isNaN(values.duration_minutes)
        ? values.duration_minutes
        : null,
    is_free_preview: values.is_free_preview,
    sort_order: values.sort_order ?? 0,
    is_published: values.is_published,
  };

  switch (values.content_type) {
    case "text":
      payload.video_url = null;
      payload.audio_url = null;
      payload.file_path = null;
      break;

    case "video":
      payload.content = null;
      payload.audio_url = null;
      payload.file_path = null;
      break;

    case "audio":
      payload.content = null;
      payload.video_url = null;
      payload.file_path = null;
      break;

    case "file":
      payload.content = null;
      payload.video_url = null;
      payload.audio_url = null;
      break;
  }

  return payload;
}
