<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('parent')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'parent_id'   => 'nullable|exists:categories,id',
            'section'     => 'required|in:her,him,dog-togs,unisex',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
            'is_active'   => 'boolean',
            'sort_order'  => 'integer'
        ]);

        $validated['slug']    = Str::slug($validated['name']) . '-' . uniqid();
        $validated['section'] = strtolower($validated['section']);

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::with('parent', 'children')->findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        
        $validated = $request->validate([
            'parent_id'   => 'nullable|exists:categories,id',
            'section'     => 'in:her,him,dog-togs,unisex',
            'name'        => 'string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
            'is_active'   => 'boolean',
            'sort_order'  => 'integer'
        ]);

        if (isset($validated['section'])) {
            $validated['section'] = strtolower($validated['section']);
        }

        if (isset($validated['name']) && $validated['name'] !== $category->name) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        }

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
