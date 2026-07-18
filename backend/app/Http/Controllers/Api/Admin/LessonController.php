<?php

namespace App\Http\Controllers\Api\Admin;





use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\admin\StoreLessonRequest;
use App\Http\Requests\admin\UpdateLessonRequest;
use App\Models\Lesson;
use App\Services\FileUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
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

            return $this->successResponse(
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

            return $this->successResponse($lesson, Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            return $this->handleException($th);


        }
    }

    public function show(Lesson $lesson)
    {
        try {
            return $this->successResponse($lesson);
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

            if (isset($data['audio_url']) && $data['audio_url'] !== $lesson->audio_url) {
                $filesToDelete[] = $lesson->audio_url;
            }

            if (isset($data['file_path']) && $data['file_path'] !== $lesson->file_path) {
                $filesToDelete[] = $lesson->file_path;
            }

            // آپدیت دیتابیس
            if (isset($data['title'])) {
                $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
            }
            $lesson->update($data);

            // حذف فایل‌های قدیمی فقط پس از موفقیت‌آمیز بودن دیتابیس
            foreach ($filesToDelete as $filePath) {
                $this->uploader->delete($filePath);
            }

            return $this->successResponse($lesson, Response::HTTP_OK);

        } catch (\Throwable $th) {
            return $this->handleException($th);
        }
    }

    public function reorder(Request $request)
    {
        $data = $request->validate([
            'section_id' => ['required', 'exists:course_sections,id'],
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:lessons,id'],
        ]);

        $sectionId = (int) $data['section_id'];
        $lessonIds = $data['ids'];

        $validLessonIds = Lesson::query()
            ->where('section_id', $sectionId)
            ->whereIn('id', $lessonIds)
            ->pluck('id')
            ->all();

        if (count($validLessonIds) !== count($lessonIds)) {
            throw new \InvalidArgumentException('One or more lessons do not belong to the selected section.');
        }

        DB::transaction(function () use ($lessonIds, $sectionId): void {
            foreach ($lessonIds as $index => $id) {
                Lesson::query()
                    ->where('id', $id)
                    ->where('section_id', $sectionId)
                    ->update([
                        'sort_order' => $index + 1,
                    ]);
            }
        });

        return $this->successResponse([
            'message' => 'Lessons reordered successfully',
        ]);
    }

    public function destroy(Lesson $lesson): JsonResponse
    {
        // اگر کلاس Lesson از SoftDeletes استفاده می‌کند:
        // این متد فقط فیلد deleted_at را پر می‌کند و فایل‌ها روی سرور باقی می‌مانند

        try {
            $lesson->delete();

            return $this->successResponse([
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

            return $this->successResponse([
                'message' => 'درس و تمامی فایل‌های مربوط به آن برای همیشه حذف شدند.'
            ], Response::HTTP_OK);

        } catch (\Throwable $th) {
            return $this->handleException($th);
        }
    }
}
