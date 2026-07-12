"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type LessonMediaUploaderProps = {
  value?: string | null;
  onChange: (value: string | null) => void;
  accept?: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  uploadFile?: (file: File) => Promise<string>;
};

export function LessonMediaUploader({
  value,
  onChange,
  accept,
  label,
  placeholder,
  disabled,
  uploadFile,
}: LessonMediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePick = () => {
    if (disabled || isUploading) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (file?: File) => {
    if (!file || !uploadFile) return;

    try {
      setIsUploading(true);
      const uploadedPath = await uploadFile(file);
      onChange(uploadedPath);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0])}
        disabled={disabled || isUploading}
      />

      <div
        className={cn(
          "rounded-xl border border-dashed p-4",
          "flex flex-col gap-3",
        )}
      >
        <div className="text-sm font-medium">{label}</div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handlePick}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                در حال آپلود...
              </>
            ) : (
              <>
                <UploadCloud className="ml-2 h-4 w-4" />
                انتخاب فایل
              </>
            )}
          </Button>

          {value ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => onChange(null)}
              disabled={disabled || isUploading}
            >
              <X className="ml-2 h-4 w-4" />
              حذف فایل
            </Button>
          ) : null}
        </div>

        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder={placeholder}
          disabled={disabled || isUploading}
          dir="ltr"
        />

        {value ? (
          <p className="text-xs text-muted-foreground break-all">{value}</p>
        ) : null}
      </div>
    </div>
  );
}
