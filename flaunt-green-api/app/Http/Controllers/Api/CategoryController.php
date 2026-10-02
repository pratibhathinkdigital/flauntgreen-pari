<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::with('children')
            ->whereNull('parent_id')
            ->where('is_active', true);

        if ($request->has('section')) {
            $query->whereRaw('LOWER(section) = ?', [strtolower($request->section)]);
        }

        $categories = $query->orderBy('sort_order')->get()->map(function ($cat) {
            $cat->section = strtolower($cat->section);
            return $cat;
        });

        return response()->json($categories);
    }

    public function show($slug)
    {
        $category = Category::with(['children', 'products' => function($q) {
            $q->where('is_active', true)->with(['primaryImage', 'variants']);
        }])->where('slug', $slug)->where('is_active', true)->firstOrFail();
        
        return response()->json($category);
    }
}
