"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadsApi, type UploadType } from "../services/uploads-api";

export function useUpload() {
  return useMutation({
    mutationFn: (params: { file: File; type: UploadType }) =>
      uploadsApi.upload(params),
    onError: (err) => {
      console.error(err);
      toast.error("آپلود فایل ناموفق بود");
    },
  });
}
