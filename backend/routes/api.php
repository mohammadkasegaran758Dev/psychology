<?php

use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\PaymentController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\UploadController;

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\CourseController;
use App\Http\Controllers\Api\Admin\CourseSectionController;
use App\Http\Controllers\Api\Admin\LessonController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\EnrollmentController;
use App\Http\Controllers\Api\Admin\OrderController;

use App\Http\Controllers\StreamController;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Auth
    |--------------------------------------------------------------------------
    */

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Authenticated Admin
        |--------------------------------------------------------------------------
        */

        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        /*
        |--------------------------------------------------------------------------
        | Courses / Sections / Lessons
        |--------------------------------------------------------------------------
        */




        // مرتب‌سازی سکشن‌ها
        Route::patch('sections/reorder', [CourseSectionController::class, 'reorder']);

        // مرتب‌سازی درس‌ها
        Route::patch('lessons/reorder', [LessonController::class, 'reorder']);


        // Route::apiResource('sections', CourseSectionController::class);

        // Route::apiResource('lessons', LessonController::class);

        // Route::delete(
        //     'lessons/{id}/force',
        //     [LessonController::class, 'forceDestroy']
        // );


        Route::delete('lessons/{id}/force', [LessonController::class, 'forceDestroy'])
            ->whereNumber('id');

        Route::apiResource('lessons', LessonController::class)
            ->where(['lesson' => '[0-9]+']);

        Route::apiResource('sections', CourseSectionController::class)
            ->where(['section' => '[0-9]+']);

        Route::apiResource('courses', CourseController::class);


        /*
        |--------------------------------------------------------------------------
        | Users
        |--------------------------------------------------------------------------
        */

        Route::apiResource('users', UserController::class);

        /*
        |--------------------------------------------------------------------------
        | Uploads
        |--------------------------------------------------------------------------
        */

        Route::post(
            '/uploads',
            [UploadController::class, 'upload']
        );

        Route::post(
            '/uploads/chunk',
            [UploadController::class, 'chunkUpload']
        );

        /*
        |--------------------------------------------------------------------------
        | Secure Streaming
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/lessons/{lesson}/stream',
            [StreamController::class, 'streamVideo']
        );

        /*
        |--------------------------------------------------------------------------
        | Enrollments
        |--------------------------------------------------------------------------
        */

        Route::apiResource(
            'enrollments',
            EnrollmentController::class
        );

        Route::patch(
            'enrollments/{enrollment}/revoke',
            [EnrollmentController::class, 'revoke']
        );

        /*
        |--------------------------------------------------------------------------
        | Course Students
        |--------------------------------------------------------------------------
        */

        Route::get(
            'courses/{course}/enrollments',
            [EnrollmentController::class, 'courseEnrollments']
        );

        /*
        |--------------------------------------------------------------------------
        | Orders
        |--------------------------------------------------------------------------
        */

        Route::get(
            'orders',
            [OrderController::class, 'index']
        );

        Route::get(
            'orders/{order}',
            [OrderController::class, 'show']
        );

        Route::patch(
            'orders/{order}/status',
            [OrderController::class, 'updateStatus']
        );


        /*
          |--------------------------------------------------------------------------
          | Category
          |--------------------------------------------------------------------------
          */


        Route::get(
            'categories/tree',
            [CategoryController::class, 'tree']
        );

        Route::get(
            'categories/options',
            [CategoryController::class, 'options']
        );

        Route::apiResource(
            'categories',
            CategoryController::class
        );

        /*
          |--------------------------------------------------------------------------
          | Payment
          |--------------------------------------------------------------------------
          */


        Route::get(
            'payments',
            [PaymentController::class, 'index']
        );

        Route::get(
            'payments/{payment}',
            [PaymentController::class, 'show']
        );


    });
});
