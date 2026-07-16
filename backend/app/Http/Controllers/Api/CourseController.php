<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\Content\CourseContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function show(string $slug, Request $request, CourseContentService $courseContentService): JsonResponse
    {
        $course = Course::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with(['category'])
            ->firstOrFail();

        $content = $courseContentService->buildCourseView($course, $request->user());

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
                'has_access' => $content['has_access'],
                'is_enrolled' => $content['is_enrolled'],
                'sections' => $content['sections'],
            ],
        ]);
    }
}
