<?php

namespace Tests\Unit;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\User;
use App\Services\Content\CourseContentService;
use App\Services\CourseAccessService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseContentServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_only_sees_free_preview_lessons(): void
    {
        $creator = User::factory()->create();
        $course = Course::create([
            'title' => 'Sample Course',
            'slug' => 'sample-course',
            'type' => 'full_course',
            'price' => 100,
            'discount_price' => null,
            'status' => 'published',
            'created_by' => $creator->id,
        ]);

        $section = $course->sections()->create([
            'title' => 'Section 1',
            'sort_order' => 1,
        ]);

        $previewLesson = $section->lessons()->create([
            'course_id' => $course->id,
            'section_id' => $section->id,
            'title' => 'Preview Lesson',
            'slug' => 'preview-lesson',
            'content_type' => 'video',
            'is_free_preview' => true,
            'sort_order' => 1,
        ]);

        $section->lessons()->create([
            'course_id' => $course->id,
            'section_id' => $section->id,
            'title' => 'Locked Lesson',
            'slug' => 'locked-lesson',
            'content_type' => 'video',
            'is_free_preview' => false,
            'sort_order' => 2,
        ]);

        $service = new CourseContentService(new CourseAccessService());
        $content = $service->buildCourseView($course, null);

        $lessons = $content['sections'][0]['lessons'];

        $this->assertCount(1, $lessons);
        $this->assertSame($previewLesson->id, $lessons[0]['id']);
        $this->assertTrue($lessons[0]['is_free_preview']);
        $this->assertTrue($lessons[0]['is_locked'] === false);
    }

    public function test_non_enrolled_user_cannot_see_locked_lessons(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $course = Course::create([
            'title' => 'Sample Course 2',
            'slug' => 'sample-course-2',
            'type' => 'full_course',
            'price' => 100,
            'discount_price' => null,
            'status' => 'published',
            'created_by' => $user->id,
        ]);

        $section = $course->sections()->create([
            'title' => 'Section 1',
            'sort_order' => 1,
        ]);

        $section->lessons()->create([
            'course_id' => $course->id,
            'section_id' => $section->id,
            'title' => 'Preview Lesson',
            'slug' => 'preview-lesson-2',
            'content_type' => 'video',
            'is_free_preview' => true,
            'sort_order' => 1,
        ]);

        $section->lessons()->create([
            'course_id' => $course->id,
            'section_id' => $section->id,
            'title' => 'Locked Lesson',
            'slug' => 'locked-lesson-2',
            'content_type' => 'video',
            'is_free_preview' => false,
            'sort_order' => 2,
        ]);

        $service = new CourseContentService(new CourseAccessService());
        $content = $service->buildCourseView($course, $user);
        $lessons = $content['sections'][0]['lessons'];

        $this->assertCount(1, $lessons);
        $this->assertTrue($lessons[0]['is_free_preview']);
    }

    public function test_enrolled_user_and_admin_can_see_all_lessons(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $course = Course::create([
            'title' => 'Sample Course 3',
            'slug' => 'sample-course-3',
            'type' => 'full_course',
            'price' => 100,
            'discount_price' => null,
            'status' => 'published',
            'created_by' => $user->id,
        ]);

        $section = $course->sections()->create([
            'title' => 'Section 1',
            'sort_order' => 1,
        ]);

        $section->lessons()->create([
            'course_id' => $course->id,
            'section_id' => $section->id,
            'title' => 'Preview Lesson',
            'slug' => 'preview-lesson-3',
            'content_type' => 'video',
            'is_free_preview' => true,
            'sort_order' => 1,
        ]);

        $section->lessons()->create([
            'course_id' => $course->id,
            'section_id' => $section->id,
            'title' => 'Locked Lesson',
            'slug' => 'locked-lesson-3',
            'content_type' => 'video',
            'is_free_preview' => false,
            'sort_order' => 2,
        ]);

        Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'active',
            'access_type' => 'purchase',
        ]);

        $service = new CourseContentService(new CourseAccessService());
        $content = $service->buildCourseView($course, $user);
        $lessons = $content['sections'][0]['lessons'];

        $this->assertCount(2, $lessons);
        $this->assertFalse($lessons[1]['is_locked']);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $adminContent = $service->buildCourseView($course, $admin);
        $adminLessons = $adminContent['sections'][0]['lessons'];

        $this->assertCount(2, $adminLessons);
    }
}
