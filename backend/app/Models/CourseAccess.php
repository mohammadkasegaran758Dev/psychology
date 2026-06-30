<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseAccess extends Model
{
    protected $table = 'course_access';

    protected $fillable = [
        'user_id',
        'course_id',
        'granted_at',
        'expires_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}

