<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
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
                'required',
                'string',
                'max:255'
            ],

            'type' => [
                'required',
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
                'required',
                'numeric',
                'min:0'
            ],

            'discount_price' => [
                'nullable',
                'numeric',
                'min:0'
            ],

            'status' => [
                'required',
                'in:draft,published,archived'
            ],

            'cover_image' => [
                'nullable',
                'string'
            ],
        ];
    }

}
