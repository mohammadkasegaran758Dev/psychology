<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->withCount('courses')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'message' => 'Categories fetched successfully.',
            'data' => $categories,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $category = Category::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $courses = Course::query()
            ->where('category_id', $category->id)
            ->where('status', 'published')
            ->with('category')
            ->latest('created_at')
            ->get();

        return response()->json([
            'message' => 'Category fetched successfully.',
            'data' => [
                'id' => $category->id,
                'name' => $category->title,
                'slug' => $category->slug,
                'description' => $category->description,
                'courses' => $courses,
            ],
        ]);
    }
}
