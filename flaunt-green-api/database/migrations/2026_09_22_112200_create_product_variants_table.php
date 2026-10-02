<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            // Size: S, M, L, XL, XXL, XS, ONE SIZE — especially for dog products XS exists
            $table->string('size');
            // Colour name and hex, matches the colors[] array in frontend
            $table->string('color_name')->nullable();   // e.g. "Flycatcher Blue"
            $table->string('color_hex')->nullable();    // e.g. "#2A5A8A"
            $table->integer('stock')->default(0);
            $table->string('sku')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
