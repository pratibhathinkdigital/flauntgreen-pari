<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'product_slug',
        'product_name',
        'name',
        'email',
        'rating',
        'title',
        'body',
        'images',
        'status',
        'is_verified',
        'likes_count',
    ];

    protected $casts = [
        'rating'      => 'integer',
        'is_verified' => 'boolean',
        'images'      => 'array',
        'likes_count' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
