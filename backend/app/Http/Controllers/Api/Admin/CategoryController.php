<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::with([
            'parent',
            'children'
        ])
            ->latest()
            ->paginate(20);

        return response()->json([
            'data' => $categories
        ]);
    }

    public function tree()
    {
        $categories = Category::whereNull('parent_id')
            ->with('childrenRecursive')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $categories
        ]);
    }
    public function options()
    {
        $categories = Category::select(
            'id',
            'title',
            'parent_id'
        )
            ->orderBy('title')
            ->get();

        return response()->json([
            'data' => $categories
        ]);
    }

    public function store(
        StoreCategoryRequest $request
    ): JsonResponse {

        $category = Category::create(
            $request->validated()
        );

        return response()->json([
            'message' => 'دسته‌بندی ایجاد شد.',
            'data' => $category
        ]);
    }

    public function show(
        Category $category
    ): JsonResponse {

        $category->load([
            'parent',
            'children',
            'courses'
        ]);

        return response()->json([
            'data' => $category
        ]);
    }

    public function update(
        UpdateCategoryRequest $request,
        Category $category
    ): JsonResponse {

        $category->update(
            $request->validated()
        );

        return response()->json([
            'message' => 'دسته‌بندی بروزرسانی شد.',
            'data' => $category
        ]);
    }

    public function destroy(
        Category $category
    ): JsonResponse {

        if ($category->children()->exists()) {
            return response()->json([
                'message' => 'ابتدا زیر دسته‌ها را حذف کنید.'
            ], 422);
        }

        if ($category->courses()->exists()) {
            return response()->json([
                'message' => 'این دسته دارای دوره است و قابل حذف نیست.'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'دسته‌بندی حذف شد.'
        ]);
    }
}
