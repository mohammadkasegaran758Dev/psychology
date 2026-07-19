<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();

            $table->foreignId('course_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('section_id')
                ->constrained('course_sections')
                ->cascadeOnDelete();

            $table->string('title');
            $table->string('slug')->unique();

            $table->enum('content_type', [
                'video',
                'audio',
                'text',
                'file'
            ]);

            $table->string('video_url')->nullable();
            $table->string('audio_url')->nullable();
            $table->string('file_path')->nullable();

            $table->longText('content')->nullable();

            $table->integer('duration_minutes')->nullable();

            $table->boolean('is_free_preview')
                ->default(false);

            $table->integer('sort_order')
                ->default(0);



            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        // Schema::dropIfExists('lessons');

        Schema::table('lessons', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
