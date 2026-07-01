<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadFileRequest;
use App\Services\FileUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    protected FileUploader $uploader;

    public function __construct(FileUploader $uploader)
    {
        $this->uploader = $uploader;
    }

    public function upload(UploadFileRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $type = $request->input('type');

        // تعیین پوشه مقصد بر اساس نوع فایل ارسالی
        $folder = match ($type) {
            'course_image' => 'courses/images',
            'lesson_video' => 'lessons/videos',
            'lesson_audio' => 'lessons/audios',
            'attachment' => 'lessons/attachments',
            default => 'uploads/others',
        };

        try {
            // آپلود روی دیسک پیش‌فرض (public)
            // $result = $this->uploader->upload($file, $folder);
            $disk = in_array($type, ['lesson_video', 'lesson_audio']) ? 'private' : 'public';

            $result = $this->uploader->upload($file, $folder, $disk);


            return response()->json([
                'message' => 'فایل با موفقیت آپلود شد.',
                'data' => [
                    'path' => $result['path'], // این مقدار در دیتابیس ذخیره می‌شود
                    'url' => $result['url'],   // این مقدار برای پیش‌نمایش در فرانت‌استفاده می‌شود
                    'name' => $result['original_name'],
                    'size' => $result['size'],
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'خطایی در فرآیند آپلود رخ داده است.',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function chunkUpload(Request $request): JsonResponse
    {
        $identifier = $request->input('resumableIdentifier');
        $chunkNumber = (int) $request->input('resumableChunkNumber');
        $totalChunks = (int) $request->input('resumableTotalChunks');
        $fileName = $request->input('resumableFilename');
        $type = $request->input('type', 'lesson_video');

        $file = $request->file('file');

        // پوشه موقت برای ذخیره تکه‌ها قبل از ترکیب
        $tempFolder = 'chunks/' . $identifier;

        // ذخیره تکه جاری در پوشه موقت روی دیسک local
        $chunkName = "chunk_{$chunkNumber}";
        Storage::disk('local')->putFileAs($tempFolder, $file, $chunkName);

        // بررسی اینکه آیا تمام تکه‌ها آپلود شده‌اند؟
        $uploadedChunks = count(Storage::disk('local')->files($tempFolder));

        if ($uploadedChunks === $totalChunks) {
            // ۱. ترکیب تکه‌ها در یک فایل نهایی
            $finalFolder = match ($type) {
                'course_image' => 'courses/images',
                'lesson_video' => 'lessons/videos',
                'lesson_audio' => 'lessons/audios',
                default => 'uploads/others',
            };

            // انتخاب دیسک مناسب بر اساس نوع فایل
            $disk = in_array($type, ['lesson_video', 'lesson_audio']) ? 'private' : 'public';

            $extension = pathinfo($fileName, PATHINFO_EXTENSION);
            $finalFileName = Str::uuid() . '.' . $extension;
            $finalPath = $finalFolder . '/' . $finalFileName;

            // ایجاد فایل نهایی و ریختن تکه‌ها داخل آن
            $realFinalPath = Storage::disk($disk)->path($finalPath);

            // اطمینان از وجود دایرکتوری نهایی
            if (!file_exists(dirname($realFinalPath))) {
                mkdir(dirname($realFinalPath), 0755, true);
            }

            $out = fopen($realFinalPath, "wb");

            for ($i = 1; $i <= $totalChunks; $i++) {
                $chunkPath = Storage::disk('local')->path("{$tempFolder}/chunk_{$i}");
                $in = fopen($chunkPath, "rb");
                while ($buff = fread($in, 4096)) {
                    fwrite($out, $buff);
                }
                fclose($in);
            }
            fclose($out);

            // ۲. پاک کردن پوشه موقت تکه‌ها
            Storage::disk('local')->deleteDirectory($tempFolder);

            return response()->json([
                'message' => 'فایل با موفقیت به صورت کامل آپلود و ترکیب شد.',
                'data' => [
                    'path' => $finalPath,
                    'url' => $disk === 'public' ? Storage::disk('public')->url($finalPath) : null, // ویدیوهای خصوصی مستقیم url عمومی ندارند
                ]
            ], Response::HTTP_CREATED);
        }

        return response()->json([
            'message' => "تکه {$chunkNumber} با موفقیت دریافت شد.",
            'progress' => round(($uploadedChunks / $totalChunks) * 100, 2)
        ], Response::HTTP_OK);
    }
}
