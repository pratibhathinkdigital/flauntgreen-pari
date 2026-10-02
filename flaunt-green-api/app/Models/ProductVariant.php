<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = ['product_id', 'size', 'color_name', 'color_hex', 'stock', 'sku'];

    protected $casts = ['stock' => 'integer'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
