<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreLessonRequest extends FormRequest
{


    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'course_id' => ['required', 'exists:courses,id'],
            'section_id' => ['required', 'exists:course_sections,id'],
            'title' => ['required', 'string', 'max:255'],
            'content_type' => ['required', 'in:video,audio,text,file'],
            // Validation شرطی حرفه‌ای
            'video_url' => ['required_if:content_type,video', 'nullable', 'url'],
            'audio_url' => ['required_if:content_type,audio', 'nullable', 'url'],
            'file_path' => ['required_if:content_type,file', 'nullable', 'string'],
            'content' => ['nullable', 'string'],
            'duration_minutes' => ['nullable', 'integer'],
            'is_free_preview' => ['boolean'],
            'sort_order' => ['integer'],
        ];
    }

}



