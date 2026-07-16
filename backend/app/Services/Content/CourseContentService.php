<?php

namespace App\Services\Content;

use App\Models\Course;
use App\Models\User;
use App\Services\CourseAccessService;

class CourseContentService
{
    public function __construct(
        protected CourseAccessService $accessService
    ) {
    }

    public function buildCourseView(Course $course, ?User $user): array
    {
        $course->loadMissing([
            'sections' => fn($query) => $query->orderBy('sort_order'),
            'sections.lessons' => fn($query) => $query->orderBy('sort_order'),
        ]);

        $hasAccess = $this->accessService->userHasAccess($user, $course);
        $isEnrolled = false;

        if ($user) {
            $isEnrolled = $user->enrollments()
                ->where('course_id', $course->id)
                ->where('status', 'active')
                ->exists();
        }

        $sections = $course->sections->map(function ($section) use ($hasAccess): array {
            $lessons = $section->lessons
                ->filter(fn($lesson) => $hasAccess || (bool) $lesson->is_free_preview)
                ->map(function ($lesson) use ($hasAccess): array {
                    $canAccessLesson = $hasAccess || (bool) $lesson->is_free_preview;

                    return [
                        'id' => $lesson->id,
                        'title' => $lesson->title,
                        'sort_order' => $lesson->sort_order,
                        'duration' => $lesson->duration_minutes,
                        'is_free_preview' => (bool) $lesson->is_free_preview,
                        'is_locked' => !$canAccessLesson,
                        'video_url' => $canAccessLesson ? $lesson->video_url : null,
                    ];
                });

            return [
                'id' => $section->id,
                'title' => $section->title,
                'sort_order' => $section->sort_order,
                'lessons' => $lessons,
            ];
        });

        return [
            'has_access' => $hasAccess,
            'is_enrolled' => $isEnrolled,
            'sections' => $sections,
        ];
    }
}
