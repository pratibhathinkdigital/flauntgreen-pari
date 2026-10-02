<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('inspiration_title')->nullable()->after('returns_info');
            $table->text('inspiration_description_1')->nullable()->after('inspiration_title');
            $table->text('inspiration_description_2')->nullable()->after('inspiration_description_1');
            $table->string('inspiration_image')->nullable()->after('inspiration_description_2');
            $table->string('inspiration_circle_image')->nullable()->after('inspiration_image');
            $table->string('inspiration_sketch_image')->nullable()->after('inspiration_circle_image');
            $table->json('inspiration_colors')->nullable()->after('inspiration_sketch_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'inspiration_title',
                'inspiration_description_1',
                'inspiration_description_2',
                'inspiration_image',
                'inspiration_circle_image',
                'inspiration_sketch_image',
                'inspiration_colors',
            ]);
        });
    }
};
