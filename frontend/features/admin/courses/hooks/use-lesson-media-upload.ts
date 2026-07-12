"use client";

import { useUpload } from "@/features/admin/uploads/hooks/use-upload";

type UploadKind = "video" | "audio" | "file";

export function useLessonMediaUpload() {
  const upload = useUpload();

  const uploadFile = async (file: File, kind: UploadKind) => {
    if (kind !== "video") {
      throw new Error("در حال حاضر فقط آپلود ویدئو پشتیبانی می‌شود.");
    }

    const result = await upload.mutateAsync({
      file,
      type: "lesson_video",
    });

    return result.path;
  };

  return {
    uploadFile,
    isUploading: upload.isPending,
  };
}
