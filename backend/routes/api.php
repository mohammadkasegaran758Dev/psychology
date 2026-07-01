<?php
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\CourseController;
use App\Http\Controllers\Api\Admin\CourseSectionController;
use App\Http\Controllers\Api\Admin\LessonController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\StreamController;
use App\Http\Controllers\Admin\EnrollmentController as AdminEnrollmentController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;


Route::prefix('admin')->group(function () {

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        Route::apiResource('courses', CourseController::class);
        Route::apiResource('sections', CourseSectionController::class);
        Route::apiResource('lessons', LessonController::class);

        Route::apiResource('users', UserController::class);

        // upload
        Route::post('/uploads', [UploadController::class, 'upload']);

        Route::delete('lessons/{id}/force', [LessonController::class, 'forceDestroy']);

        Route::get('/lessons/{lesson}/stream', [StreamController::class, 'streamVideo']);

        Route::post('/uploads/chunk', [UploadController::class, 'chunkUpload']);



        // مسیرهای مدیریت دسترسی‌ها (Enrollments)
        Route::get('courses/{course}/enrollments', [AdminEnrollmentController::class, 'index']);
        Route::post('enrollments', [AdminEnrollmentController::class, 'store']);
        Route::delete('enrollments', [AdminEnrollmentController::class, 'destroy']);

        // مسیرهای مدیریت سفارشات
        Route::get('orders', [AdminOrderController::class, 'index']);
        Route::get('orders/{order}', [AdminOrderController::class, 'show']);
        Route::put('orders/{order}/status', [AdminOrderController::class, 'updateStatus']);




    });
});
