<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['primaryImage', 'variants', 'category', 'collection'])
            ->where('is_active', true);

        if ($request->has('category') && $request->category) {
            $cat = $request->category;
            $query->whereHas('category', function($q) use ($cat) {
                $q->where('slug', $cat)
                  ->orWhere('slug', 'like', $cat . '%')
                  ->orWhere('name', 'like', '%' . $cat . '%')
                  ->orWhere('section', $cat);
            });
        }

        if ($request->has('collection') && $request->collection) {
            $col = $request->collection;
            $query->whereHas('collection', function($q) use ($col) {
                $q->where('slug', $col)
                  ->orWhere('slug', 'like', $col . '%')
                  ->orWhere('name', 'like', '%' . $col . '%');
            });
        }
        
        if ($request->has('section') && $request->section) {
            $sec = strtolower($request->section);
            $query->whereHas('category', function($q) use ($sec) {
                if (in_array($sec, ['her', 'him'])) {
                    // Include unisex products as well for her/him as requested by user
                    $q->whereIn('section', [$sec, 'unisex']);
                } else {
                    $q->where('section', $sec);
                }
            });
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('fabric', 'like', "%{$search}%")
                  ->orWhere('colour', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhereHas('category', function($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%")
                         ->orWhere('slug', 'like', "%{$search}%");
                  })
                  ->orWhereHas('collection', function($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%")
                         ->orWhere('slug', 'like', "%{$search}%");
                  });
            });
        }

        // EKAM collection products are prioritized first on all listings (Shop All, Her, Him)
        $query->orderByRaw("CASE WHEN collection_id IN (SELECT id FROM collections WHERE slug LIKE '%ekam%' OR name LIKE '%ekam%') THEN 0 ELSE 1 END")
              ->orderBy('id', 'asc');

        if ($request->has('limit') && is_numeric($request->limit)) {
            $query->limit((int)$request->limit);
        }

        return response()->json($query->get());
    }

    public function show($slug)
    {
        $product = Product::with(['category', 'collection', 'images', 'variants'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
            
        // Map similar products and style with products from slugs to objects with images
        $styleWith = [];
        if ($product->style_with) {
            $styleWith = Product::with(['primaryImage'])->whereIn('slug', $product->style_with)->where('is_active', true)->get();
        }
        
        $similarProducts = [];
        if ($product->similar_products) {
            $similarProducts = Product::with(['primaryImage'])->whereIn('slug', $product->similar_products)->where('is_active', true)->get();
        }

        $data = $product->toArray();
        $data['style_with_products'] = $styleWith;
        $data['similar_products_details'] = $similarProducts;

        return response()->json($data);
    }
}
