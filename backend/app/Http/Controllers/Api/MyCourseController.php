<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MyCourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $enrollments = $request->user()->enrollments()->with('course')->get();

        return response()->json([
            'message' => 'My courses fetched successfully.',
            'data' => $enrollments->map(fn($enrollment) => [
                'id' => $enrollment->course->id,
                'title' => $enrollment->course->title,
                'slug' => $enrollment->course->slug,
                'thumbnail' => $enrollment->course->cover_image,
                'enrollment' => [
                    'id' => $enrollment->id,
                    'status' => $enrollment->status,
                    'enrolled_at' => $enrollment->created_at,
                ],
            ]),
        ]);
    }

    public function content(Request $request, int $courseId): JsonResponse
    {
        $course = $request->user()->courses()->where('courses.id', $courseId)->firstOrFail();

        $course->load([
            'sections' => function ($query) {
                $query->orderBy('sort_order');
            },
            'sections.lessons' => function ($query) {
                $query->orderBy('sort_order');
            }
        ]);

        return response()->json([
            'message' => 'Course content fetched successfully.',
            'data' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'sections' => $course->sections->map(fn($section) => [
                    'id' => $section->id,
                    'title' => $section->title,
                    'sort_order' => $section->sort_order,
                    'lessons' => $section->lessons->map(fn($lesson) => [
                        'id' => $lesson->id,
                        'title' => $lesson->title,
                        'sort_order' => $lesson->sort_order,
                        'duration' => $lesson->duration_minutes,
                        'video_url' => $lesson->video_url,
                        'is_free_preview' => (bool) $lesson->is_free_preview,
                    ]),
                ]),
            ],
        ]);
    }
}
