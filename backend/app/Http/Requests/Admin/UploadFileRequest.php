<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UploadFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        // با توجه به اینکه مسیر تحت middleware ادمین است، اینجا را true می‌گذاریم
        return true;
    }

    public function rules(): array
    {
        // دریافت نوع آپلود ارسالی از سمت کاربر
        $type = $this->input('type');

        // تعریف قوانین بر اساس نوع فایل
        $fileRules = ['required', 'file'];

        switch ($type) {
            case 'course_image':
                // عکس کاور دوره: حداکثر ۵ مگابایت، فقط فرمت‌های تصویری وب
                $fileRules[] = 'max:5120'; // 5MB
                $fileRules[] = 'mimes:jpg,jpeg,png,webp';
                break;

            case 'lesson_video':
                // ویدیو درس: حداکثر ۲۵۰ مگابایت، فرمت‌های ویدیویی استاندارد
                $fileRules[] = 'max:256000'; // 250MB
                $fileRules[] = 'mimes:mp4,mov,mkv';
                break;

            case 'lesson_audio':
                // فایل صوتی/پادکست درس: حداکثر ۱۰۰ مگابایت
                $fileRules[] = 'max:102400'; // 100MB
                $fileRules[] = 'mimes:mp3,wav,m4a';
                break;

            case 'attachment':
                // فایل‌های پیوست/جزوه: حداکثر ۵۰ مگابایت
                $fileRules[] = 'max:51200'; // 50MB
                $fileRules[] = 'mimes:pdf,zip,rar,doc,docx,ppt,pptx';
                break;

            default:
                // در صورت ارسال تایپ نامعتبر
                $fileRules[] = 'max:2048'; // 2MB
                $fileRules[] = 'mimes:jpg,png,pdf';
        }

        return [
            'file' => $fileRules,
            'type' => 'required|string|in:course_image,lesson_video,lesson_audio,attachment'
        ];
    }
}
