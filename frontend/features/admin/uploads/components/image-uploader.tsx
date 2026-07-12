"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUpload } from "../hooks/use-upload";

type ImageUploaderProps = {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  uploadType?: "course_image";
  disabled?: boolean;
  label?: string;
  hint?: string;
};

function resolveImageSrc(src: string | null | undefined): string | null {
  if (!src) return null;
  if (src.startsWith("blob:")) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  return `${backendUrl}/storage/${src.replace(/^\/+/, "")}`;
}

export function ImageUploader({
  value,
  onChange,
  uploadType = "course_image",
  disabled = false,
  label = "تصویر کاور",
  hint = "فایل تصویر را انتخاب کنید تا آپلود شود.",
}: ImageUploaderProps) {
  const upload = useUpload();
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  // priority: local preview while uploading, then saved value
  const previewSrc = useMemo(() => {
    return resolveImageSrc(localPreview || value || null);
  }, [localPreview, value]);

  const onFilePick = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    try {
      const result = await upload.mutateAsync({ file, type: uploadType });

      // set backend path in form
      onChange(result.path);

      // IMPORTANT:
      // do NOT clear local preview immediately if server preview may still fail
      // We'll clear it only if value exists and later render naturally switches.
      // If your backend URL works, this can be removed safely.
      setTimeout(() => {
        setLocalPreview(null);
      }, 500);
    } catch (e) {
      // keep local preview on error? better to clear and let user retry
      setLocalPreview(null);
      throw e;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">{label}</p>
          {hint ? (
            <p className="text-muted-foreground text-xs">{hint}</p>
          ) : null}
        </div>

        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || upload.isPending}
            onClick={() => {
              onChange(null);
              setLocalPreview(null);
            }}
          >
            <X className="ml-2 size-4" />
            حذف
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            disabled={disabled || upload.isPending}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              void onFilePick(file);
              e.currentTarget.value = "";
            }}
          />

          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            {upload.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                در حال آپلود...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                بعد از انتخاب فایل، آپلود شروع می‌شود
              </>
            )}
          </div>

          <Input
            value={value ?? ""}
            placeholder="مسیر/URL تصویر بعد از آپلود"
            disabled
            className="text-xs"
          />
        </div>

        <div
          className={cn(
            "relative flex min-h-[160px] items-center justify-center overflow-hidden rounded-md border bg-muted",
          )}
        >
          {previewSrc ? (
            // use plain img to avoid next/image optimizer issues
            <img
              src={previewSrc}
              alt="cover preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground text-sm">پیش‌نمایش تصویر</div>
          )}
        </div>
      </div>
    </div>
  );
}
