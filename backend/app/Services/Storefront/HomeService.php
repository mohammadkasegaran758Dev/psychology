<?php

namespace App\Services\Storefront;

use App\Models\Category;
use App\Models\Course;

class HomeService
{
    public function getHomeData(): array
    {
        return [
            'featured_courses' => Course::query()
                ->where('status', 'published')
                ->with('category')
                ->latest('created_at')
                ->limit(6)
                ->get(),
            'newest_courses' => Course::query()
                ->where('status', 'published')
                ->with('category')
                ->latest('created_at')
                ->limit(6)
                ->get(),
            'categories' => Category::query()
                ->where('is_active', true)
                ->latest('sort_order')
                ->limit(8)
                ->get(),
        ];
    }
}
