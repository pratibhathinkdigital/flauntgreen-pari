<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Product;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $products = Product::whereNull('sku')->orWhere('sku', '')->get();
        foreach ($products as $product) {
            $clean = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $product->name), 0, 4)) ?: 'PRD';
            $sku = 'FG-' . $clean . '-' . str_pad($product->id, 3, '0', STR_PAD_LEFT);
            $product->update(['sku' => $sku]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op
    }
};
