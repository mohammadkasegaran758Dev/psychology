<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\StreamController;

use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Api\Admin\CourseSectionController as AdminCourseSectionController;
use App\Http\Controllers\Api\Admin\EnrollmentController as AdminEnrollmentController;
use App\Http\Controllers\Api\Admin\LessonController as AdminLessonController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\MeController;
use App\Http\Controllers\Api\MyCourseController;
use App\Http\Controllers\Api\MyOrderController;
use App\Http\Controllers\Api\MyPaymentController;
use App\Http\Controllers\Api\OrderController as CustomerOrderController;
use App\Http\Controllers\Api\PaymentController as CustomerPaymentController;

/*
|--------------------------------------------------------------------------
| Public Storefront Routes
|--------------------------------------------------------------------------
*/

Route::get('/home', [HomeController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{slug}', [CourseController::class, 'show']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [MeController::class, 'show']);

    Route::post('/orders', [CustomerOrderController::class, 'store']);
    Route::get('/orders/{order}', [CustomerOrderController::class, 'show']);

    Route::post('/payments/request', [CustomerPaymentController::class, 'request']);
    Route::get('/payments/verify', [CustomerPaymentController::class, 'verify']);

    Route::get('/my/courses', [MyCourseController::class, 'index']);
    Route::get('/my/courses/{course}/content', [MyCourseController::class, 'content']);

    Route::get('/my/orders', [MyOrderController::class, 'index']);
    Route::get('/my/orders/{order}', [MyOrderController::class, 'show']);

    Route::get('/my/payments', [MyPaymentController::class, 'index']);
    Route::get('/my/payments/{payment}', [MyPaymentController::class, 'show']);

    Route::get('/lessons/{lesson}/stream', [StreamController::class, 'streamVideo']);
});

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

    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Authenticated Admin
        |--------------------------------------------------------------------------
        */

        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAuthController::class, 'me']);

        /*
        |--------------------------------------------------------------------------
        | Courses / Sections / Lessons
        |--------------------------------------------------------------------------
        */




        // مرتب‌سازی سکشن‌ها
        Route::patch('sections/reorder', [AdminCourseSectionController::class, 'reorder']);

        // مرتب‌سازی درس‌ها
        Route::patch('lessons/reorder', [AdminLessonController::class, 'reorder']);


        // Route::apiResource('sections', CourseSectionController::class);

        // Route::apiResource('lessons', LessonController::class);

        // Route::delete(
        //     'lessons/{id}/force',
        //     [LessonController::class, 'forceDestroy']
        // );


        Route::delete('lessons/{id}/force', [AdminLessonController::class, 'forceDestroy'])
            ->whereNumber('id');

        Route::apiResource('lessons', AdminLessonController::class)
            ->where(['lesson' => '[0-9]+']);

        Route::apiResource('sections', AdminCourseSectionController::class)
            ->where(['section' => '[0-9]+']);

        Route::apiResource('courses', AdminCourseController::class);


        /*
        |--------------------------------------------------------------------------
        | Users
        |--------------------------------------------------------------------------
        */

        Route::apiResource('users', AdminUserController::class);

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
            AdminEnrollmentController::class
        );

        Route::patch(
            'enrollments/{enrollment}/revoke',
            [AdminEnrollmentController::class, 'revoke']
        );

        /*
        |--------------------------------------------------------------------------
        | Course Students
        |--------------------------------------------------------------------------
        */

        Route::get(
            'courses/{course}/enrollments',
            [AdminEnrollmentController::class, 'courseEnrollments']
        );

        /*
        |--------------------------------------------------------------------------
        | Orders
        |--------------------------------------------------------------------------
        */

        Route::get(
            'orders',
            [AdminOrderController::class, 'index']
        );

        Route::get(
            'orders/{order}',
            [AdminOrderController::class, 'show']
        );

        Route::patch(
            'orders/{order}/status',
            [AdminOrderController::class, 'updateStatus']
        );


        /*
          |--------------------------------------------------------------------------
          | Category
          |--------------------------------------------------------------------------
          */


        Route::get(
            'categories/tree',
            [AdminCategoryController::class, 'tree']
        );

        Route::get(
            'categories/options',
            [AdminCategoryController::class, 'options']
        );

        Route::apiResource(
            'categories',
            AdminCategoryController::class
        );

        /*
          |--------------------------------------------------------------------------
          | Payment
          |--------------------------------------------------------------------------
          */


        Route::get(
            'payments',
            [AdminPaymentController::class, 'index']
        );

        Route::get(
            'payments/{payment}',
            [AdminPaymentController::class, 'show']
        );


    });
});
