<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'category_id' => [
                'nullable',
                'exists:categories,id'
            ],

            'title' => [
                'sometimes',
                'string',
                'max:255'
            ],

            'type' => [
                'sometimes',
                'in:full_course,mini_course'
            ],

            'short_description' => [
                'nullable',
                'string'
            ],

            'description' => [
                'nullable',
                'string'
            ],

            'price' => [
                'sometimes',
                'numeric',
                'min:0'
            ],

            'discount_price' => [
                'nullable',
                'numeric',
                'min:0'
            ],

            'status' => [
                'sometimes',
                'in:draft,published,archived'
            ],

            'cover_image' => [
                'nullable',
                'string'
            ],
        ];
    }

}
