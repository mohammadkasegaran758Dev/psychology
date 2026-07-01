<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\FileUploader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    protected FileUploader $uploader;

    public function __construct(FileUploader $uploader)
    {
        $this->uploader = $uploader;
    }
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
        if (isset($data['image_path']) && $data['image_path'] !== $course->image_path) {
            $this->uploader->delete($course->image_path);
        }

        $course->update($data);

        return response()->json($course);
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return response()->json([
            'message' => 'دوره با موفقیت (به صورت موقت) حذف شد.'
        ], Response::HTTP_OK);
    }


    public function forceDestroy($id): JsonResponse
    {
        $course = Course::withTrashed()->with('lessons')->findOrFail($id);

        // ۱. حذف تصویر اصلی دوره
        $this->uploader->delete($course->image_path);

        // ۲. حذف فایل‌های تمام درس‌های مرتبط با دوره
        foreach ($course->lessons as $lesson) {
            $this->uploader->delete($lesson->video_url);
            $this->uploader->delete($lesson->audio_url);
            $this->uploader->delete($lesson->file_path);
            $lesson->forceDelete();
        }

        // ۳. حذف فیزیکی خود دوره
        $course->forceDelete();

        return response()->json([
            'message' => 'دوره، تمام درس‌ها و فایل‌های مرتبط با آن‌ها برای همیشه حذف شدند.'
        ], Response::HTTP_OK);
    }
}
