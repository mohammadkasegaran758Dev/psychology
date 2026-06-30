<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = [
        'course_id',
        'section_id',
        'title',
        'slug',
        'content_type',
        'video_url',
        'audio_url',
        'file_path',
        'content',
        'duration_minutes',
        'is_free_preview',
        'sort_order'
    ];

    // تبدیل خودکار فیلدها به تایپ‌های درست در خروجی API
    protected $casts = [
        'is_free_preview' => 'boolean',
        'duration_minutes' => 'integer',
        'sort_order' => 'integer',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function section()
    {
        return $this->belongsTo(CourseSection::class, 'section_id');
    }
}
