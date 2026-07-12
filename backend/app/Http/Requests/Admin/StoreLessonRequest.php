<?php

namespace App\Http\Requests\admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'section_id' => ['required', 'integer', 'exists:course_sections,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'content_type' => ['required', Rule::in(['video', 'audio', 'text', 'file'])],

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
