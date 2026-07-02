<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Services\CourseAccessService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

class StreamController extends Controller
{
    /**
     * استریم امن ویدیوی درس
     */
    public function streamVideo(
        Request $request,
        Lesson $lesson,
        CourseAccessService $accessService
    ): BinaryFileResponse {

        /*
        |--------------------------------------------------------------------------
        | بررسی دسترسی کاربر به دوره
        |--------------------------------------------------------------------------
        */
        if (
            !$accessService->userHasAccess(
                $request->user(),
                $lesson->course
            )
        ) {
            abort(
                Response::HTTP_FORBIDDEN,
                'شما به این دوره دسترسی ندارید.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | بررسی وجود فایل ویدیو
        |--------------------------------------------------------------------------
        */
        $path = $lesson->video_url;

        if (!$path) {
            abort(
                Response::HTTP_NOT_FOUND,
                'ویدیو برای این درس ثبت نشده است.'
            );
        }

        if (!Storage::disk('private')->exists($path)) {
            abort(
                Response::HTTP_NOT_FOUND,
                'فایل ویدیو روی سرور یافت نشد.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | مسیر فیزیکی فایل
        |--------------------------------------------------------------------------
        */
        $fileFullPath = Storage::disk('private')->path($path);

        /*
        |--------------------------------------------------------------------------
        | تشخیص mime type
        |--------------------------------------------------------------------------
        */
        $mimeType = Storage::disk('private')->mimeType($path)
            ?: 'video/mp4';

        /*
        |--------------------------------------------------------------------------
        | ساخت response استریم
        |--------------------------------------------------------------------------
        */
        $response = new BinaryFileResponse($fileFullPath);

        /*
        |--------------------------------------------------------------------------
        | هدرهای استریم
        |--------------------------------------------------------------------------
        */
        $response->headers->set('Content-Type', $mimeType);

        // پشتیبانی seek در پلیر ویدیو
        $response->headers->set('Accept-Ranges', 'bytes');

        // جلوگیری از دانلود اجباری
        $response->headers->set(
            'Content-Disposition',
            'inline; filename="' . basename($fileFullPath) . '"'
        );

        // جلوگیری از cache ناخواسته
        $response->headers->set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate'
        );

        /*
        |--------------------------------------------------------------------------
        | پشتیبانی X-Sendfile / X-Accel-Redirect
        |--------------------------------------------------------------------------
        | اگر nginx/apache تنظیم شده باشند،
        | فایل مستقیم توسط web server stream می‌شود
        | و فشار از روی PHP برداشته می‌شود.
        |--------------------------------------------------------------------------
        */
        BinaryFileResponse::trustXSendfileTypeHeader();

        return $response;
    }

    /**
     * استریم امن فایل صوتی درس
     */
    public function streamAudio(
        Request $request,
        Lesson $lesson,
        CourseAccessService $accessService
    ): BinaryFileResponse {

        /*
        |--------------------------------------------------------------------------
        | بررسی دسترسی کاربر
        |--------------------------------------------------------------------------
        */
        if (
            !$accessService->userHasAccess(
                $request->user(),
                $lesson->course
            )
        ) {
            abort(
                Response::HTTP_FORBIDDEN,
                'شما به این دوره دسترسی ندارید.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | بررسی وجود فایل صوتی
        |--------------------------------------------------------------------------
        */
        $path = $lesson->audio_url;

        if (!$path) {
            abort(
                Response::HTTP_NOT_FOUND,
                'فایل صوتی برای این درس ثبت نشده است.'
            );
        }

        if (!Storage::disk('private')->exists($path)) {
            abort(
                Response::HTTP_NOT_FOUND,
                'فایل صوتی روی سرور یافت نشد.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | مسیر فیزیکی فایل
        |--------------------------------------------------------------------------
        */
        $fileFullPath = Storage::disk('private')->path($path);

        /*
        |--------------------------------------------------------------------------
        | mime type
        |--------------------------------------------------------------------------
        */
        $mimeType = Storage::disk('private')->mimeType($path)
            ?: 'audio/mpeg';

        /*
        |--------------------------------------------------------------------------
        | ساخت response
        |--------------------------------------------------------------------------
        */
        $response = new BinaryFileResponse($fileFullPath);

        /*
        |--------------------------------------------------------------------------
        | هدرها
        |--------------------------------------------------------------------------
        */
        $response->headers->set('Content-Type', $mimeType);

        $response->headers->set('Accept-Ranges', 'bytes');

        $response->headers->set(
            'Content-Disposition',
            'inline; filename="' . basename($fileFullPath) . '"'
        );

        $response->headers->set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate'
        );

        /*
        |--------------------------------------------------------------------------
        | X-Sendfile support
        |--------------------------------------------------------------------------
        */
        BinaryFileResponse::trustXSendfileTypeHeader();

        return $response;
    }
}
