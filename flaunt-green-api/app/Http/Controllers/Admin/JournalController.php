<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class JournalController extends Controller
{
    public function index()
    {
        $journals = Journal::orderBy('published_at', 'desc')->get();
        return response()->json($journals);
    }

    public function store(Request $request)
    {
        if ($request->has('is_published')) {
            $request->merge(['is_published' => filter_var($request->input('is_published'), FILTER_VALIDATE_BOOLEAN)]);
        }

        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'type'         => 'required|in:blog,social-outreach',
            'excerpt'      => 'nullable|string',
            'content'      => 'nullable|string',
            'quote'        => 'nullable|string',
            'quote_author' => 'nullable|string|max:255',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['published_at'] = $validated['published_at'] ?? now();

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image_url'] = $request->file('image')->store('journals', 'public');
        }

        $journal = Journal::create($validated);
        return response()->json($journal, 201);
    }

    public function show($id)
    {
        $journal = Journal::findOrFail($id);
        return response()->json($journal);
    }

    public function update(Request $request, $id)
    {
        $journal = Journal::findOrFail($id);

        if ($request->has('is_published')) {
            $request->merge(['is_published' => filter_var($request->input('is_published'), FILTER_VALIDATE_BOOLEAN)]);
        }

        $validated = $request->validate([
            'title'        => 'string|max:255',
            'type'         => 'in:blog,social-outreach',
            'excerpt'      => 'nullable|string',
            'content'      => 'nullable|string',
            'quote'        => 'nullable|string',
            'quote_author' => 'nullable|string|max:255',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($journal->getRawOriginal('image_url')) {
                Storage::disk('public')->delete($journal->getRawOriginal('image_url'));
            }
            $validated['image_url'] = $request->file('image')->store('journals', 'public');
        }

        $journal->update($validated);
        return response()->json($journal);
    }

    public function destroy($id)
    {
        $journal = Journal::findOrFail($id);

        if ($journal->getRawOriginal('image_url')) {
            Storage::disk('public')->delete($journal->getRawOriginal('image_url'));
        }

        $journal->delete();
        return response()->json(['message' => 'Journal post deleted successfully']);
    }
}
