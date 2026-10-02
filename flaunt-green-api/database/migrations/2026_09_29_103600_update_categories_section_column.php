<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Modify 'section' column to string (VARCHAR 50) to allow 'unisex' and other sections
        Schema::table('categories', function (Blueprint $table) {
            DB::statement("ALTER TABLE categories MODIFY COLUMN section VARCHAR(50) NOT NULL");
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            DB::statement("ALTER TABLE categories MODIFY COLUMN section ENUM('her', 'him', 'dog-togs') NOT NULL");
        });
    }
};
