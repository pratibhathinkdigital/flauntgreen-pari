<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('collection_id')->nullable()->constrained()->nullOnDelete();

            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // Pricing
            $table->decimal('price', 10, 2);
            $table->decimal('compare_price', 10, 2)->nullable(); // MRP / strikethrough price

            // Product Info
            $table->string('sku')->nullable();
            $table->string('fabric')->nullable();
            $table->string('fit')->nullable();          // e.g. "A Line (Relaxed)", "Straight"
            $table->string('colour')->nullable();       // primary colour name

            // Model info for the PDP "Model is wearing" block
            $table->string('model_size')->nullable();   // e.g. "S"
            $table->string('model_measurements')->nullable(); // e.g. 'Bust 31", Waist 23"'

            // Long text fields (stored as TEXT)
            $table->text('materials')->nullable();      // bullet points
            $table->text('wash_care')->nullable();      // JSON array of strings
            $table->text('shipping_info')->nullable();
            $table->text('returns_info')->nullable();

            // Flags
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);

            // Dog-specific
            $table->boolean('is_dog_product')->default(false);

            // Related products (stored as JSON arrays of slugs)
            $table->json('style_with')->nullable();     // slugs to "Style With" carousel
            $table->json('similar_products')->nullable(); // slugs to "You May Also Like"

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
