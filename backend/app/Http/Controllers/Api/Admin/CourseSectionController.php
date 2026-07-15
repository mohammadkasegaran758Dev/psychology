<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourseSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function reorder(Request $request)
    {
        $sectionIds = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:course_sections,id'],
        ])['ids'];

        DB::transaction(function () use ($sectionIds) {
            foreach ($sectionIds as $index => $id) {
                CourseSection::whereKey($id)->update([
                    'sort_order' => $index + 1,
                ]);
            }
        });

        return response()->json([
            'message' => 'Sections reordered successfully.',
        ]);
    }

    // public function reorder(Request $request)
    // {
    //     // دریافت آرایه IDها از فرانت‌اند
    //     $ids = $request->input('ids'); // فرض می‌کنیم فرانت‌اند {ids: [1, 5, 2, ...]} می‌فرستد

    //     DB::transaction(function () use ($ids) {
    //         foreach ($ids as $index => $id) {
    //             CourseSection::where('id', $id)->update(['sort_order' => $index + 1]);
    //         }
    //     });

    //     return response()->json(['message' => 'ترتیب سکشن‌ها با موفقیت به‌روزرسانی شد.']);
    // }


    public function destroy(CourseSection $section)
    {
        $section->delete();
        return response()->json(['message' => 'Section deleted']);
    }
}
