<?php

namespace App\Http\Requests\admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // در ویرایش، همه فیلدها optional هستند (sometimes)
            'course_id' => ['sometimes', 'integer', 'exists:courses,id'],
            'section_id' => ['sometimes', 'integer', 'exists:course_sections,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'content_type' => ['sometimes', Rule::in(['video', 'audio', 'text', 'file'])],

            // مسیر فایل، نه URL کامل
            'video_url' => [
                Rule::requiredIf(fn() => $this->input('content_type') === 'video'),
                'nullable',
                'string',
                'max:2048',
            ],
            'audio_url' => [
                Rule::requiredIf(fn() => $this->input('content_type') === 'audio'),
                'nullable',
                'string',
                'max:2048',
            ],
            'file_path' => [
                Rule::requiredIf(fn() => $this->input('content_type') === 'file'),
                'nullable',
                'string',
                'max:2048',
            ],
            'content' => [
                Rule::requiredIf(fn() => $this->input('content_type') === 'text'),
                'nullable',
                'string',
            ],

            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'is_free_preview' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }
}
