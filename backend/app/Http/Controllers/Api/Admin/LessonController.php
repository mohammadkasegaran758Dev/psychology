<?php

namespace App\Http\Controllers\Api\Admin;





use App\Http\Controllers\Api\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLessonRequest;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LessonController extends BaseApiController
{

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

    public function update(StoreLessonRequest $request, Lesson $lesson)
    {
        try {
            $data = $request->validated();

            // اگر عنوان تغییر کرده بود، اسلاگ جدید ساخته شود
            if (isset($data['title'])) {
                $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
            }

            $lesson->update($data);

            return response()->json($lesson);
        } catch (\Throwable $th) {
            return $this->handleException($th);


        }
    }

    public function destroy(Lesson $lesson)
    {
        try {
            $lesson->delete();

            return response()->json([
                'message' => 'Lesson deleted successfully'
            ]);
        } catch (\Throwable $th) {
            return $this->handleException($th);


        }
    }
}
