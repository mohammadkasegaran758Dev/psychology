<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourseSection;
use Illuminate\Http\Request;

class CourseSectionController extends Controller
{
    public function index(Request $request)
    {
        // برای دریافت سکشن‌های یک دوره خاص: GET /api/admin/sections?course_id=1
        $query = CourseSection::query();

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        return response()->json($query->orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'title' => ['required', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $section = CourseSection::create($data);

        return response()->json($section, 201);
    }

    public function update(Request $request, CourseSection $section)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $section->update($data);

        return response()->json($section);
    }

    public function destroy(CourseSection $section)
    {
        $section->delete();
        return response()->json(['message' => 'Section deleted']);
    }
}
