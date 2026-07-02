<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'parent_id' => [
                'nullable',
                'exists:categories,id',
                'not_in:' . $this->route('category')->id
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
                'unique:categories,slug'
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
