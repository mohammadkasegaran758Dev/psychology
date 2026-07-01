<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploader
{
    /**
     * آپلود فایل روی دیسک مشخص شده
     *
     * @param UploadedFile $file
     * @param string $folder پوشه مقصد (مثل courses, lessons/videos)
     * @param string $disk دیسک مورد نظر (پیش‌فرض public)
     * @return array شامل مسیر ذخیره شده و url کامل دسترسی
     */
    public function upload(UploadedFile $file, string $folder, string $disk = 'public'): array
    {
        // تولید یک نام رندوم و امن برای جلوگیری از تداخل نام‌ها
        $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();

        // ذخیره فایل روی دیسک
        $path = $file->storeAs($folder, $fileName, $disk);

        return [
            'path' => $path,
            'url' => Storage::disk($disk)->url($path),
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(), // به بایت
        ];
    }

    /**
     * حذف فایل از روی دیسک
     */
    public function delete(?string $path, string $disk = 'public'): bool
    {
        if ($path && Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }
        return false;
    }
}
