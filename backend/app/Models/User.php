<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function createdCourses()
    {
        return $this->hasMany(Course::class, 'created_by');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function courseAccesses()
    {
        return $this->hasMany(CourseAccess::class);
    }

    public function accessibleCourses()
    {
        return $this->belongsToMany(Course::class, 'course_access')
            ->withTimestamps()
            ->withPivot(['granted_at', 'expires_at']);
    }


    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function courses()
    {
        return $this->belongsToMany(
            Course::class,
            'enrollments'
        );
    }

    public function payments()
    {
        return $this->hasMany(
            Payment::class
        );
    }

}
