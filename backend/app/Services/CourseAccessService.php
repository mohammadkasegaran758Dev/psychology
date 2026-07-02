<?php

namespace App\Services;

use App\Models\Course;
use App\Models\User;

class CourseAccessService
{
    /**
     * بررسی دسترسی کاربر به دوره
     */
    public function userHasAccess(?User $user, Course $course): bool
    {
        // دوره رایگان
        if ($course->is_free) {
            return true;
        }

        // کاربر لاگین نکرده
        if (!$user) {
            return false;
        }

        // ادمین
        if ($user->is_admin) {
            return true;
        }

        // enrollment فعال
        return $user->enrollments()
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->where(function ($query) {
                $query
                    ->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->exists();
    }
}
