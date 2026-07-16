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
        if ($this->courseIsFree($course)) {
            return true;
        }

        if (!$user) {
            return false;
        }

        if ($user->role === 'admin') {
            return true;
        }

        return $this->hasActiveEnrollment($user, $course);
    }

    protected function courseIsFree(Course $course): bool
    {
        $finalPrice = (float) ($course->discount_price ?? $course->price);

        return $finalPrice <= 0;
    }

    protected function hasActiveEnrollment(User $user, Course $course): bool
    {
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
