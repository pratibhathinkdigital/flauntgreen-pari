<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CollectionController extends Controller
{
    public function index()
    {
        return response()->json(Collection::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'banner_image' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();

        $collection = Collection::create($validated);
        return response()->json($collection, 201);
    }

    public function show($id)
    {
        return response()->json(Collection::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'banner_image' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ]);

        if (isset($validated['name']) && $validated['name'] !== $collection->name) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        }

        $collection->update($validated);
        return response()->json($collection);
    }

    public function destroy($id)
    {
        $collection = Collection::findOrFail($id);
        $collection->delete();
        return response()->json(['message' => 'Collection deleted successfully']);
    }
}
