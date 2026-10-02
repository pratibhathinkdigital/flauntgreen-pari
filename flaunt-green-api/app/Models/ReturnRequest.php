<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id',
        'order_number',
        'reason',
        'items',
        'images',
        'customer_notes',
        'status',
        'rejection_reason',
        'resolution_type',
        'refund_payment_method',
        'refund_account_details',
        'refund_amount',
        'refund_transaction_id',
        'replacement_tracking_number',
        'replacement_courier_name',
        'admin_notes',
    ];

    protected $casts = [
        'items' => 'array',
        'images' => 'array',
        'refund_account_details' => 'array',
        'refund_amount' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
