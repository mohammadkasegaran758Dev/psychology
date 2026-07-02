<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Services\EnrollmentService;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index()
    {
        $enrollments = Enrollment::with([
            'user',
            'course'
        ])
            ->latest()
            ->paginate(20);

        return response()->json($enrollments);
    }

    public function show(Enrollment $enrollment)
    {
        $enrollment->load([
            'user',
            'course',
            'order'
        ]);

        return response()->json($enrollment);
    }

    public function store(
        Request $request,
        EnrollmentService $enrollmentService
    ) {

        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'course_id' => ['required', 'exists:courses,id'],
        ]);

        $enrollment = $enrollmentService->enroll(
            userId: $data['user_id'],
            courseId: $data['course_id'],
            orderId: null,
            accessType: 'manual'
        );

        return response()->json([
            'message' => 'دسترسی با موفقیت ایجاد شد.',
            'data' => $enrollment
        ]);
    }

    public function revoke(
        Enrollment $enrollment,
        EnrollmentService $enrollmentService
    ) {

        $enrollmentService->revoke(
            $enrollment->user_id,
            $enrollment->course_id
        );

        return response()->json([
            'message' => 'دسترسی کاربر لغو شد.'
        ]);
    }

    public function destroy(Enrollment $enrollment)
    {
        $enrollment->delete();

        return response()->json([
            'message' => 'Enrollment حذف شد.'
        ]);
    }

    public function courseEnrollments(Course $course)
    {
        $enrollments = Enrollment::with('user')
            ->where('course_id', $course->id)
            ->latest()
            ->paginate(20);

        return response()->json($enrollments);
    }
}
