<?php
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\CourseController;
use App\Http\Controllers\Api\Admin\CourseSectionController;
use App\Http\Controllers\Api\Admin\LessonController;
use App\Http\Controllers\Api\Admin\UserController;



Route::prefix('admin')->group(function () {

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        Route::apiResource('courses', CourseController::class);
        Route::apiResource('sections', CourseSectionController::class);
        Route::apiResource('lessons', LessonController::class);

        Route::apiResource('users', UserController::class);

    });
});
