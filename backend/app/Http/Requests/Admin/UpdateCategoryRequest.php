<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('category')->id;

        return [

            'parent_id' => [
                'nullable',
                'exists:categories,id'
            ],

            'title' => [
                'required',
                'string',
                'max:255'
            ],

            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'slug')
                    ->ignore($categoryId)
            ],

            'description' => [
                'nullable',
                'string'
            ],

            'image' => [
                'nullable',
                'string'
            ],

            'is_active' => [
                'boolean'
            ],

            'sort_order' => [
                'integer'
            ],
        ];
    }
}
