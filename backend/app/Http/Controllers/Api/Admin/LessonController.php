<?php

namespace App\Http\Controllers\Api\Admin;





use App\Http\Controllers\Api\BaseApiController;
use App\Http\Controllers\Controller;


use App\Http\Requests\admin\StoreLessonRequest;
use App\Http\Requests\admin\UpdateLessonRequest;
use App\Models\Lesson;
use App\Services\FileUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;


class LessonController extends BaseApiController
{

    protected FileUploader $uploader;
    public function __construct(FileUploader $uploader)
    {
        $this->uploader = $uploader;
    }
    public function index(Request $request)
    {
        try {
            $query = Lesson::query();

            if ($request->has('course_id')) {
                $query->where('course_id', $request->course_id);
            }

            if ($request->has('section_id')) {
                $query->where('section_id', $request->section_id);
            }

            return response()->json(
                $query->orderBy('sort_order')->get()
            );

        } catch (\Throwable $th) {
            return $this->handleException($th);
        }
    }

    public function store(StoreLessonRequest $request)
    {
        try {
            $data = $request->validated();

            // ۱. ساخت اسلاگ یکتا به صورت خودکار
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);

            // ۲. تنظیم خودکار ترتیب (sort_order) در صورت عدم ارسال از سمت فرانت
            if (!isset($data['sort_order'])) {
                $maxOrder = Lesson::where('section_id', $data['section_id'])->max('sort_order') ?? 0;
                $data['sort_order'] = $maxOrder + 1;
            }

            $lesson = Lesson::create($data);

            return response()->json($lesson, 201);
        } catch (\Throwable $th) {
            return $this->handleException($th);


        }
    }

    public function show(Lesson $lesson)
    {
        try {
            return response()->json($lesson);
        } catch (\Throwable $th) {
            return $this->handleException($th);


        }
    }

    public function update(UpdateLessonRequest $request, Lesson $lesson): JsonResponse
    {
        try {
            $data = $request->validated();

            // تعریف آرایه‌ای برای فایل‌هایی که باید بعد از موفقیت حذف شوند
            $filesToDelete = [];

            if (isset($data['video_url']) && $data['video_url'] !== $lesson->video_url) {
                $filesToDelete[] = $lesson->video_url;
            }

            // ... همین کار را برای audio و file انجام دهید

            // آپدیت دیتابیس
            if (isset($data['title'])) {
                $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
            }
            $lesson->update($data);

            // حذف فایل‌های قدیمی فقط پس از موفقیت‌آمیز بودن دیتابیس
            foreach ($filesToDelete as $filePath) {
                $this->uploader->delete($filePath);
            }

            return response()->json([
                'message' => 'درس با موفقیت بروزرسانی شد.',
                'data' => $lesson
            ], Response::HTTP_OK);

        } catch (\Throwable $th) {
            return $this->handleException($th);
        }
    }

    public function destroy(Lesson $lesson): JsonResponse
    {
        // اگر کلاس Lesson از SoftDeletes استفاده می‌کند:
        // این متد فقط فیلد deleted_at را پر می‌کند و فایل‌ها روی سرور باقی می‌مانند

        try {
            $lesson->delete();

            return response()->json([
                'message' => 'درس با موفقیت (به صورت موقت) حذف شد.'
            ], Response::HTTP_OK);

        } catch (\Throwable $th) {
            return $this->handleException($th);
        }
    }

    /**
     * متد حذف دائمی درس (Force Delete) همراه با پاک کردن فیزیکی تمام فایل‌ها از سرور
     * این متد را می‌توانید در مسیرهای وب‌پنل ادمین برای پاکسازی کامل قرار دهید
     */
    public function forceDestroy($id): JsonResponse
    {

        try {
            // پیدا کردن 
            // درس، حتی درس‌های سافت‌دیلیت شده
            $lesson = Lesson::withTrashed()->findOrFail($id);

            // ۱. حذف فایل‌های فیزیکی درس از سرور
            $this->uploader->delete($lesson->video_url);
            $this->uploader->delete($lesson->audio_url);
            $this->uploader->delete($lesson->file_path);

            // ۲. حذف دائمی رکورد از دیتابیس
            $lesson->forceDelete();

            return response()->json([
                'message' => 'درس و تمامی فایل‌های مربوط به آن برای همیشه حذف شدند.'
            ], Response::HTTP_OK);

        } catch (\Throwable $th) {
            return $this->handleException($th);
        }
    }
}
