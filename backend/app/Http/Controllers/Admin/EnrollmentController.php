<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Course;
use App\Services\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EnrollmentController extends Controller
{
    protected EnrollmentService $enrollmentService;

    public function __construct(EnrollmentService $enrollmentService)
    {
        $this->enrollmentService = $enrollmentService;
    }

    /**
     * لیست ثبت‌نامی‌های یک دوره خاص
     */
    public function index(Course $course): JsonResponse
    {
        $enrollments = Enrollment::with('user:id,name,email')
            ->where('course_id', $course->id)
            ->paginate(20);

        return response()->json($enrollments);
    }

    /**
     * اعطای دسترسی دستی به کاربر
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'access_type' => 'nullable|in:gift,manual',
        ]);

        $enrollment = $this->enrollmentService->enroll(
            userId: $validated['user_id'],
            courseId: $validated['course_id'],
            accessType: $validated['access_type'] ?? 'manual'
        );

        return response()->json([
            'message' => 'دسترسی با موفقیت برقرار شد.',
            'data' => $enrollment->load('user:id,name,email', 'course:id,title')
        ], 201);
    }

    /**
     * لغو دسترسی کاربر به دوره
     */
    public function destroy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
        ]);

        $this->enrollmentService->revoke($validated['user_id'], $validated['course_id']);

        return response()->json([
            'message' => 'دسترسی کاربر با موفقیت لغو شد.'
        ]);
    }
}
