<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::latest()->paginate(10);

        return response()->json($courses);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:full_course,mini_course'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric'],
            'discount_price' => ['nullable', 'numeric'],
            'status' => ['required', 'in:draft,published,archived']
        ]);

        $data['slug'] = Str::slug($data['title']);
        $data['created_by'] = $request->user()->id;

        $course = Course::create($data);

        return response()->json($course, 201);
    }

    public function show(Course $course)
    {
        return response()->json($course);
    }

    public function update(Request $request, Course $course)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'in:full_course,mini_course'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric'],
            'discount_price' => ['nullable', 'numeric'],
            'status' => ['sometimes', 'in:draft,published,archived']
        ]);

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $course->update($data);

        return response()->json($course);
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }
}
