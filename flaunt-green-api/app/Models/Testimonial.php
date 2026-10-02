<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'city',
        'quote',
        'rating',
        'page', // 'home', 'dog_togs', 'both'
        'is_active',
        'sort_order',
        'avatar',
    ];

    protected $casts = [
        'rating'     => 'integer',
        'is_active'  => 'boolean',
        'sort_order' => 'integer',
    ];
}
