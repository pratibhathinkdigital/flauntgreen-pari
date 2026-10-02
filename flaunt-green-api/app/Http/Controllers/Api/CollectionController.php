<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    public function index()
    {
        $collections = Collection::where('is_active', true)->orderBy('sort_order')->get();
        return response()->json($collections);
    }

    public function show($slug)
    {
        $collection = Collection::with(['products' => function($q) {
            $q->where('is_active', true)->with(['primaryImage', 'variants']);
        }])->where('slug', $slug)->where('is_active', true)->firstOrFail();
        
        return response()->json($collection);
    }
}
