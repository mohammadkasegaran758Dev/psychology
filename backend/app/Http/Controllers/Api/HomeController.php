<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function index(): JsonResponse
    {
        $featuredCourses = Course::query()
            ->where('status', 'published')
            ->with('category')
            ->latest('created_at')
            ->limit(6)
            ->get();

        $newestCourses = Course::query()
            ->where('status', 'published')
            ->with('category')
            ->latest('created_at')
            ->limit(6)
            ->get();

        $categories = Category::query()
            ->where('is_active', true)
            ->latest('sort_order')
            ->limit(8)
            ->get();

        return response()->json([
            'message' => 'Home data fetched successfully.',
            'data' => [
                'featured_courses' => $featuredCourses,
                'newest_courses' => $newestCourses,
                'categories' => $categories,
            ],
        ]);
    }
}
