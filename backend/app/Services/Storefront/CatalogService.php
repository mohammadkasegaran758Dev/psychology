<?php

namespace App\Services\Storefront;

use App\Models\Course;
use Illuminate\Database\Eloquent\Builder;

class CatalogService
{
    public function applyFilters(Builder $query, array $filters): Builder
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters): void {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('short_description', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        return $query;
    }
}
