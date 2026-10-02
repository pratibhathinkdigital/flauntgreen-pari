<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seo extends Model
{
    protected $fillable = [
        'route',
        'title',
        'description',
        'keywords',
        'og_image',
    ];
}
