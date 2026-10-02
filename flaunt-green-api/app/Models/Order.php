<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'shipping_name',
        'shipping_phone',
        'shipping_address',
        'subtotal',
        'shipping_cost',
        'tax',
        'total',
        'status',
        'delivered_at',
        'return_status',
        'payment_method',
        'payment_status',
        'razorpay_order_id',
        'razorpay_payment_id',
        'notes',
    ];

    protected $casts = [
        'delivered_at' => 'datetime',
        'total' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function returnRequest()
    {
        return $this->hasOne(ReturnRequest::class);
    }
}
