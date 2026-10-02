<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'collection', 'primaryImage', 'variants'])->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        // Normalize boolean fields coming from FormData ('true'/'false' or '1'/'0')
        foreach (['is_featured', 'is_active', 'is_dog_product'] as $field) {
            if ($request->has($field)) {
                $val = $request->input($field);
                $request->merge([$field => filter_var($val, FILTER_VALIDATE_BOOLEAN)]);
            }
        }

        // Normalize wash_care if passed as string or JSON
        if ($request->has('wash_care')) {
            $raw = $request->input('wash_care');
            if (is_string($raw)) {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    $request->merge(['wash_care' => $decoded]);
                } else {
                    $lines = array_values(array_filter(array_map('trim', explode("\n", $raw))));
                    $request->merge(['wash_care' => $lines]);
                }
            }
        }

        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'collection_id' => 'nullable|exists:collections,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'sku' => 'nullable|string|max:255',
            'fabric' => 'nullable|string|max:255',
            'fit' => 'nullable|string|max:255',
            'colour' => 'nullable|string|max:255',
            'model_size' => 'nullable|string|max:255',
            'model_measurements' => 'nullable|string|max:255',
            'materials' => 'nullable|string',
            'wash_care' => 'nullable|array',
            'shipping_info' => 'nullable|string',
            'returns_info' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'is_dog_product' => 'boolean',
            'style_with' => 'nullable|array',
            'similar_products' => 'nullable|array',
            'inspiration_title' => 'nullable|string|max:255',
            'inspiration_description_1' => 'nullable|string',
            'inspiration_description_2' => 'nullable|string',
            'inspiration_colors' => 'nullable|array',
            // Arrays for relations
            'variants' => 'nullable|array',
            'variants.*.size' => 'required|string|max:255',
            'variants.*.color_name' => 'nullable|string|max:255',
            'variants.*.color_hex' => 'nullable|string|max:255',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.sku' => 'nullable|string|max:255',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();

        DB::beginTransaction();
        try {
            // Extract variants and images before creating product
            $variants = $request->input('variants', []);

            // Handle Inspiration specific image uploads
            if ($request->hasFile('inspiration_image')) {
                $validated['inspiration_image'] = $request->file('inspiration_image')->store('inspiration', 'public');
            }
            if ($request->hasFile('inspiration_circle_image')) {
                $validated['inspiration_circle_image'] = $request->file('inspiration_circle_image')->store('inspiration', 'public');
            }
            if ($request->hasFile('inspiration_sketch_image')) {
                $validated['inspiration_sketch_image'] = $request->file('inspiration_sketch_image')->store('inspiration', 'public');
            }

            $product = Product::create($validated);

            // Handle images (enforce maximum 5 images)
            if ($request->hasFile('images')) {
                $imageFiles = array_slice($request->file('images'), 0, 5);
                foreach ($imageFiles as $index => $file) {
                    $path = $file->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $path,
                        'is_primary' => $index === 0,
                        'sort_order' => $index
                    ]);
                }
            }

            // Handle variants
            foreach ($variants as $variantData) {
                $product->variants()->create($variantData);
            }

            DB::commit();
            return response()->json($product->load(['images', 'variants', 'category']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create product', 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $product = Product::with(['category', 'collection', 'images', 'variants'])->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        // Normalize boolean fields coming from FormData ('true'/'false' or '1'/'0')
        foreach (['is_featured', 'is_active', 'is_dog_product'] as $field) {
            if ($request->has($field)) {
                $val = $request->input($field);
                $request->merge([$field => filter_var($val, FILTER_VALIDATE_BOOLEAN)]);
            }
        }

        // Normalize wash_care if passed as string or JSON
        if ($request->has('wash_care')) {
            $raw = $request->input('wash_care');
            if (is_string($raw)) {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    $request->merge(['wash_care' => $decoded]);
                } else {
                    $lines = array_values(array_filter(array_map('trim', explode("\n", $raw))));
                    $request->merge(['wash_care' => $lines]);
                }
            }
        }

        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'collection_id' => 'nullable|exists:collections,id',
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'sku' => 'nullable|string|max:255',
            'fabric' => 'nullable|string|max:255',
            'fit' => 'nullable|string|max:255',
            'colour' => 'nullable|string|max:255',
            'model_size' => 'nullable|string|max:255',
            'model_measurements' => 'nullable|string|max:255',
            'materials' => 'nullable|string',
            'wash_care' => 'nullable|array',
            'shipping_info' => 'nullable|string',
            'returns_info' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'is_dog_product' => 'boolean',
            'style_with' => 'nullable|array',
            'similar_products' => 'nullable|array',
            'inspiration_title' => 'nullable|string|max:255',
            'inspiration_description_1' => 'nullable|string',
            'inspiration_description_2' => 'nullable|string',
            'inspiration_colors' => 'nullable|array',
            // Arrays for relations
            'variants' => 'nullable|array',
            'variants.*.id' => 'nullable|exists:product_variants,id',
            'variants.*.size' => 'required_with:variants|string|max:255',
            'variants.*.color_name' => 'nullable|string|max:255',
            'variants.*.color_hex' => 'nullable|string|max:255',
            'variants.*.stock' => 'required_with:variants|integer|min:0',
            'variants.*.sku' => 'nullable|string|max:255',
            'deleted_images' => 'nullable|array',
            'deleted_images.*' => 'exists:product_images,id',
            'deleted_variants' => 'nullable|array',
            'deleted_variants.*' => 'exists:product_variants,id',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        }

        DB::beginTransaction();
        try {
            // Handle Inspiration specific image uploads
            if ($request->hasFile('inspiration_image')) {
                if ($product->inspiration_image) Storage::disk('public')->delete($product->inspiration_image);
                $validated['inspiration_image'] = $request->file('inspiration_image')->store('inspiration', 'public');
            }
            if ($request->hasFile('inspiration_circle_image')) {
                if ($product->inspiration_circle_image) Storage::disk('public')->delete($product->inspiration_circle_image);
                $validated['inspiration_circle_image'] = $request->file('inspiration_circle_image')->store('inspiration', 'public');
            }
            if ($request->hasFile('inspiration_sketch_image')) {
                if ($product->inspiration_sketch_image) Storage::disk('public')->delete($product->inspiration_sketch_image);
                $validated['inspiration_sketch_image'] = $request->file('inspiration_sketch_image')->store('inspiration', 'public');
            }

            $product->update($validated);

            // Handle deleted variants
            if (!empty($validated['deleted_variants'])) {
                $product->variants()->whereIn('id', $validated['deleted_variants'])->delete();
            }

            // Handle updated/new variants
            if (isset($validated['variants'])) {
                foreach ($validated['variants'] as $variantData) {
                    if (isset($variantData['id'])) {
                        $product->variants()->where('id', $variantData['id'])->update($variantData);
                    } else {
                        $product->variants()->create($variantData);
                    }
                }
            }

            // Handle deleted images
            if (!empty($validated['deleted_images'])) {
                $imagesToDelete = $product->images()->whereIn('id', $validated['deleted_images'])->get();
                foreach ($imagesToDelete as $image) {
                    Storage::disk('public')->delete($image->image_url);
                    $image->delete();
                }
            }

            // Handle new images (uploaded files) with 5 total images limit
            if ($request->hasFile('images')) {
                $currentCount = $product->images()->count();
                $allowedCount = max(0, 5 - $currentCount);
                if ($allowedCount > 0) {
                    $imageFiles = array_slice($request->file('images'), 0, $allowedCount);
                    $maxSortOrder = $product->images()->max('sort_order') ?? -1;
                    foreach ($imageFiles as $index => $file) {
                        $path = $file->store('products', 'public');
                        ProductImage::create([
                            'product_id' => $product->id,
                            'image_url' => $path,
                            'is_primary' => $product->images()->count() === 0 && $index === 0,
                            'sort_order' => $maxSortOrder + $index + 1
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json($product->load(['images', 'variants', 'category']));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update product', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Delete associated images from storage
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_url);
        }
        
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function toggleStatus($id)
    {
        $product = Product::findOrFail($id);
        $product->is_active = !$product->is_active;
        $product->save();
        return response()->json($product);
    }
    
    public function toggleFeatured($id)
    {
        $product = Product::findOrFail($id);
        $product->is_featured = !$product->is_featured;
        $product->save();
        return response()->json($product);
    }
}
