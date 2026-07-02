<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCourseRequest;
use App\Http\Requests\Admin\UpdateCourseRequest;
use App\Models\Course;
use App\Services\FileUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    protected FileUploader $uploader;

    public function __construct(FileUploader $uploader)
    {
        $this->uploader = $uploader;
    }

    /**
     * لیست دوره‌ها
     */
    public function index(): JsonResponse
    {
        $courses = Course::with([
            'category',
            'creator'
        ])
            ->latest()
            ->paginate(10);

        return response()->json($courses);
    }

    /**
     * ایجاد دوره جدید
     */
    public function store(
        StoreCourseRequest $request
    ): JsonResponse {

        $data = $request->validated();

        /*
        ساخت slug یکتا
        */
        $slug = Str::slug($data['title']);

        $count = Course::where(
            'slug',
            'like',
            "{$slug}%"
        )->count();

        $data['slug'] = $count
            ? "{$slug}-" . ($count + 1)
            : $slug;

        /*
        ثبت سازنده دوره
        */
        $data['created_by'] = $request->user()->id;

        /*
        اگر منتشر شده بود
        تاریخ انتشار ثبت شود
        */
        if (
            isset($data['status'])
            && $data['status'] === 'published'
        ) {
            $data['published_at'] = now();
        }

        $course = Course::create($data);

        $course->load([
            'category',
            'creator'
        ]);

        return response()->json([
            'message' => 'دوره با موفقیت ایجاد شد.',
            'data' => $course
        ], Response::HTTP_CREATED);
    }

    /**
     * نمایش جزئیات دوره
     */
    public function show(
        Course $course
    ): JsonResponse {

        $course->load([
            'category',
            'creator',
            'lessons'
        ]);

        return response()->json([
            'data' => $course
        ]);
    }

    /**
     * بروزرسانی دوره
     */
    public function update(
        UpdateCourseRequest $request,
        Course $course
    ): JsonResponse {

        $data = $request->validated();

        /*
        اگر title تغییر کرد
        slug جدید ساخته شود
        */
        if (isset($data['title'])) {

            $slug = Str::slug($data['title']);

            $count = Course::where(
                'slug',
                'like',
                "{$slug}%"
            )
                ->where('id', '!=', $course->id)
                ->count();

            $data['slug'] = $count
                ? "{$slug}-" . ($count + 1)
                : $slug;
        }

        /*
        اگر تصویر تغییر کرد
        تصویر قبلی حذف شود
        */
        if (
            isset($data['cover_image'])
            && $data['cover_image'] !== $course->cover_image
        ) {

            if ($course->cover_image) {
                $this->uploader->delete(
                    $course->cover_image
                );
            }
        }

        /*
        اگر status منتشر شد
        و قبلاً published نبود
        */
        if (
            isset($data['status'])
            && $data['status'] === 'published'
            && !$course->published_at
        ) {
            $data['published_at'] = now();
        }

        /*
        اگر draft شد
        تاریخ انتشار null شود
        */
        if (
            isset($data['status'])
            && $data['status'] !== 'published'
        ) {
            $data['published_at'] = null;
        }

        $course->update($data);

        $course->load([
            'category',
            'creator'
        ]);

        return response()->json([
            'message' => 'دوره با موفقیت بروزرسانی شد.',
            'data' => $course
        ]);
    }

    /**
     * حذف موقت دوره
     */
    public function destroy(
        Course $course
    ): JsonResponse {

        $course->delete();

        return response()->json([
            'message' => 'دوره با موفقیت حذف شد.'
        ], Response::HTTP_OK);
    }

    /**
     * حذف دائمی دوره و فایل‌ها
     */
    public function forceDestroy(
        int $id
    ): JsonResponse {

        $course = Course::withTrashed()
            ->with([
                'lessons'
            ])
            ->findOrFail($id);

        /*
        حذف تصویر دوره
        */
        if ($course->cover_image) {

            $this->uploader->delete(
                $course->cover_image
            );
        }

        /*
        حذف فایل‌های درس‌ها
        */
        foreach ($course->lessons as $lesson) {

            if ($lesson->video_url) {
                $this->uploader->delete(
                    $lesson->video_url
                );
            }

            if ($lesson->audio_url) {
                $this->uploader->delete(
                    $lesson->audio_url
                );
            }

            if ($lesson->file_path) {
                $this->uploader->delete(
                    $lesson->file_path
                );
            }

            $lesson->forceDelete();
        }

        /*
        حذف دائمی خود دوره
        */
        $course->forceDelete();

        return response()->json([
            'message' => 'دوره و تمام فایل‌های مرتبط برای همیشه حذف شدند.'
        ], Response::HTTP_OK);
    }
}
