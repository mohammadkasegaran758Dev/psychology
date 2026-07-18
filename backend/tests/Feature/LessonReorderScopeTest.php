<?php

namespace Tests\Feature;

use App\Http\Controllers\Api\Admin\LessonController;
use App\Models\Course;
use App\Models\CourseSection;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class LessonReorderScopeTest extends TestCase
{
    use RefreshDatabase;

    public function test_lesson_reorder_only_affects_lessons_from_the_requested_section(): void
    {
        $user = User::factory()->create();
        $course = Course::create([
            'title' => 'Course',
            'slug' => 'course',
            'type' => 'full_course',
            'price' => 100,
            'status' => 'published',
            'created_by' => $user->id,
        ]);

        $firstSection = CourseSection::create([
            'course_id' => $course->id,
            'title' => 'Section A',
            'sort_order' => 1,
        ]);

        $secondSection = CourseSection::create([
            'course_id' => $course->id,
            'title' => 'Section B',
            'sort_order' => 2,
        ]);

        $firstLesson = Lesson::create([
            'course_id' => $course->id,
            'section_id' => $firstSection->id,
            'title' => 'First lesson',
            'slug' => 'first-lesson',
            'content_type' => 'video',
            'sort_order' => 1,
        ]);

        $secondLesson = Lesson::create([
            'course_id' => $course->id,
            'section_id' => $secondSection->id,
            'title' => 'Second lesson',
            'slug' => 'second-lesson',
            'content_type' => 'video',
            'sort_order' => 1,
        ]);

        $controller = app(LessonController::class);
        $request = Request::create('/api/admin/lessons/reorder', 'PATCH', [
            'section_id' => $firstSection->id,
            'ids' => [$firstLesson->id],
        ]);

        $response = $controller->reorder($request);

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame(1, $firstLesson->fresh()->sort_order);
        $this->assertSame(1, $secondLesson->fresh()->sort_order);
    }
}
