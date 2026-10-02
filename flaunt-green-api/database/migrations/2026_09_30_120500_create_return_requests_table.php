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
        Schema::create('return_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('order_number');
            $table->string('reason'); // 'incorrect_product' or 'incorrect_size'
            $table->json('items')->nullable();
            $table->json('images')->nullable();
            $table->text('customer_notes')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected, replacement_dispatched, refunded
            $table->text('rejection_reason')->nullable();
            $table->string('resolution_type')->nullable(); // replacement, refund
            $table->string('refund_payment_method')->nullable(); // cod, online
            $table->json('refund_account_details')->nullable(); // bank/upi for COD
            $table->decimal('refund_amount', 10, 2)->nullable();
            $table->string('refund_transaction_id')->nullable();
            $table->string('replacement_tracking_number')->nullable();
            $table->string('replacement_courier_name')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_requests');
    }
};
