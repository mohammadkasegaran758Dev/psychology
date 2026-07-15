<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Course::query()
            ->where('status', 'published')
            ->with('category');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request): void {
                $q->where('title', 'like', '%' . $request->input('search') . '%')
                    ->orWhere('short_description', 'like', '%' . $request->input('search') . '%');
            });
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->input('category'));
        }

        $sort = $request->input('sort', 'newest');

        match ($sort) {
            'oldest' => $query->oldest('created_at'),
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            default => $query->latest('created_at'),
        };

        $perPage = (int) $request->input('per_page', 12);
        $courses = $query->paginate($perPage);

        $courses->getCollection()->transform(function (Course $course): array {
            $finalPrice = (float) ($course->discount_price ?? $course->price);
            $isFree = $finalPrice <= 0 || (float) $course->price <= 0;

            return [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'excerpt' => $course->short_description,
                'thumbnail' => $course->cover_image,
                'price' => (float) $course->price,
                'discount_price' => $course->discount_price !== null ? (float) $course->discount_price : null,
                'final_price' => $finalPrice,
                'is_free' => $isFree,
                'category' => $course->category ? [
                    'id' => $course->category->id,
                    'name' => $course->category->title,
                    'slug' => $course->category->slug,
                ] : null,
            ];
        });

        return response()->json([
            'message' => 'Courses fetched successfully.',
            'data' => $courses->items(),
            'meta' => [
                'current_page' => $courses->currentPage(),
                'last_page' => $courses->lastPage(),
                'per_page' => $courses->perPage(),
                'total' => $courses->total(),
            ],
        ]);
    }

    public function show(string $slug, Request $request): JsonResponse
    {
        $course = Course::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with(['category', 'sections', 'lessons'])
            ->firstOrFail();

        $user = $request->user();
        $hasAccess = false;
        $isEnrolled = false;

        if ($user) {
            $isEnrolled = $user->enrollments()
                ->where('course_id', $course->id)
                ->where('status', 'active')
                ->exists();

            $hasAccess = $isEnrolled || $user->role === 'admin';
        }

        $sections = $course->sections->map(function ($section) use ($hasAccess, $course): array {
            $lessons = $section->lessons->map(function ($lesson) use ($hasAccess): array {
                $isLocked = !$hasAccess && !$lesson->is_free_preview;

                return [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'sort_order' => $lesson->sort_order,
                    'is_free_preview' => (bool) $lesson->is_free_preview,
                    'duration' => $lesson->duration_minutes,
                    'is_locked' => $isLocked,
                    'video_url' => $hasAccess ? $lesson->video_url : null,
                ];
            });

            return [
                'id' => $section->id,
                'title' => $section->title,
                'sort_order' => $section->sort_order,
                'lessons' => $lessons,
            ];
        });

        return response()->json([
            'message' => 'Course fetched successfully.',
            'data' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'description' => $course->description,
                'thumbnail' => $course->cover_image,
                'status' => $course->status,
                'price' => (float) $course->price,
                'discount_price' => $course->discount_price !== null ? (float) $course->discount_price : null,
                'final_price' => (float) ($course->discount_price ?? $course->price),
                'has_access' => $hasAccess,
                'is_enrolled' => $isEnrolled,
                'sections' => $sections,
            ],
        ]);
    }
}
