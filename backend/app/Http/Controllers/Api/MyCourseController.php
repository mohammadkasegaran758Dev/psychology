<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Content\CourseContentService;
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

    public function content(Request $request, int $courseId, CourseContentService $courseContentService): JsonResponse
    {
        $course = $request->user()->courses()->where('courses.id', $courseId)->firstOrFail();

        $content = $courseContentService->buildCourseView($course, $request->user());

        return response()->json([
            'message' => 'Course content fetched successfully.',
            'data' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'has_access' => $content['has_access'],
                'is_enrolled' => $content['is_enrolled'],
                'is_free_course' => $content['is_free_course'],
                'sections' => $content['sections'],
            ],
        ]);
    }
}
