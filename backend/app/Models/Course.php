<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'type',
        'short_description',
        'description',
        'cover_image',
        'price',
        'discount_price',
        'status',
        'published_at',
        'created_by'
    ];



    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'published_at' => 'datetime',
    ];

    public function getIsFreeAttribute(): bool
    {
        $finalPrice = $this->getFinalPrice();

        return $finalPrice <= 0;
    }

    public function getFinalPrice(): float
    {
        $price = (float) $this->price;
        $discountPrice = $this->discount_price !== null ? (float) $this->discount_price : null;

        if ($discountPrice === null) {
            return $price;
        }

        if ($discountPrice > $price) {
            return $price;
        }

        return $discountPrice;
    }

    // سازنده دوره
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // بخش‌ها
    public function sections()
    {
        return $this->hasMany(CourseSection::class)->orderBy('sort_order');
    }

    // درس‌ها
    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('sort_order');
    }

    // آیتم‌های سفارش
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // کاربران دارای دسترسی
    public function accesses()
    {
        return $this->hasMany(CourseAccess::class);
    }

    public function usersWithAccess()
    {
        return $this->belongsToMany(User::class, 'course_access')
            ->withTimestamps()
            ->withPivot(['granted_at', 'expires_at']);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(
            User::class,
            'enrollments'
        );
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}


