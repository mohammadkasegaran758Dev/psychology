<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    public function viewCourseContent(?User $user, Course $course): bool
    {
        if ($course->is_free) {
            return true;
        }

        if (!$user || $user->status !== 'active') {
            return false;
        }

        if ($user->role === 'admin') {
            return true;
        }

        return $user->enrollments()
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->exists();
    }
}
