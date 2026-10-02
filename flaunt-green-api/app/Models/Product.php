<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'collection_id', 'name', 'slug', 'description',
        'price', 'compare_price', 'sku', 'fabric', 'fit', 'colour',
        'model_size', 'model_measurements',
        'materials', 'wash_care', 'shipping_info', 'returns_info',
        'is_featured', 'is_active', 'is_dog_product',
        'style_with', 'similar_products',
        'inspiration_title', 'inspiration_description_1', 'inspiration_description_2',
        'inspiration_image', 'inspiration_circle_image', 'inspiration_sketch_image',
        'inspiration_colors',
    ];

    protected $casts = [
        'price'              => 'decimal:2',
        'compare_price'      => 'decimal:2',
        'is_featured'        => 'boolean',
        'is_active'          => 'boolean',
        'is_dog_product'     => 'boolean',
        'wash_care'          => 'array',
        'style_with'         => 'array',
        'similar_products'   => 'array',
        'inspiration_colors' => 'array',
    ];

    /* ─── Relationships ───────────────────────────────────────────────────────── */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true)->orderBy('sort_order');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /* ─── Helper: full public image URL ─────────────────────────────────────── */
    public function getImageUrlsAttribute()
    {
        return $this->images->map(fn($img) =>
            asset('storage/' . $img->image_url)
        )->values();
    }

    /* ─── Unique sizes from variants ─────────────────────────────────────────── */
    public function getSizesAttribute()
    {
        return $this->variants->pluck('size')->unique()->values();
    }

    /* ─── Unique colors from variants ────────────────────────────────────────── */
    public function getColorsAttribute()
    {
        return $this->variants
            ->whereNotNull('color_name')
            ->unique('color_name')
            ->map(fn($v) => ['name' => $v->color_name, 'value' => $v->color_hex])
            ->values();
    }
}
