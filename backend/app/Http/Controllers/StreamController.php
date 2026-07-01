<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

class StreamController extends Controller
{
    /**
     * استریم کردن ویدیوی درس‌ها به صورت امن
     */
    public function streamVideo(Request $request, $lessonId): BinaryFileResponse
    {
        $lesson = Lesson::findOrFail($lessonId);

        // TODO: بررسی دسترسی کاربر به دوره در فاز سفارشات
        // if (!$request->user()->hasAccessToCourse($lesson->course_id)) {
        //     abort(403, 'شما دسترسی به این دوره را ندارید.');
        // }

        $path = $lesson->video_url;

        if (!$path || !Storage::disk('private')->exists($path)) {
            abort(Response::HTTP_NOT_FOUND, 'فایل ویدیو یافت نشد.');
        }

        $fileFullPath = Storage::disk('private')->path($path);
        $mimeType = Storage::disk('private')->mimeType($path) ?: 'video/mp4';

        // آماده‌سازی پاسخ استریم
        $response = new BinaryFileResponse($fileFullPath);
        $response->headers->set('Content-Type', $mimeType);

        // فعال کردن هدرهای X-Sendfile / X-Accel-Redirect در صورت کانفیگ وب‌سرور
        BinaryFileResponse::trustXSendfileTypeHeader();

        return $response;
    }

    /**
     * استریم کردن فایل صوتی درس‌ها به صورت امن
     */
    public function streamAudio(Request $request, $lessonId): BinaryFileResponse
    {
        $lesson = Lesson::findOrFail($lessonId);

        // TODO: بررسی دسترسی کاربر
        // if (!$request->user()->hasAccessToCourse($lesson->course_id)) {
        //     abort(403, 'شما دسترسی به این دوره را ندارید.');
        // }

        $path = $lesson->audio_url;

        if (!$path || !Storage::disk('private')->exists($path)) {
            abort(Response::HTTP_NOT_FOUND, 'فایل صوتی یافت نشد.');
        }

        $fileFullPath = Storage::disk('private')->path($path);
        $mimeType = Storage::disk('private')->mimeType($path) ?: 'audio/mpeg';

        $response = new BinaryFileResponse($fileFullPath);
        $response->headers->set('Content-Type', $mimeType);

        BinaryFileResponse::trustXSendfileTypeHeader();

        return $response;
    }
}
