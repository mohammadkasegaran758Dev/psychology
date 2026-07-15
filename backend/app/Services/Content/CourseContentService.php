<?php

namespace App\Services\Content;

use App\Models\Course;
use App\Models\User;

class CourseContentService
{
    public function buildCourseView(Course $course, ?User $user): array
    {
        $hasAccess = false;
        $isEnrolled = false;

        if ($user) {
            $isEnrolled = $user->enrollments()
                ->where('course_id', $course->id)
                ->where('status', 'active')
                ->exists();

            $hasAccess = $isEnrolled || $user->role === 'admin';
        }

        return [
            'has_access' => $hasAccess,
            'is_enrolled' => $isEnrolled,
        ];
    }
}
