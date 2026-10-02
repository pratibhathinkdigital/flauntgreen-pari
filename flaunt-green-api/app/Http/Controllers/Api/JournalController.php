<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use Illuminate\Http\Request;

class JournalController extends Controller
{
    public function index(Request $request)
    {
        $query = Journal::where('is_published', true)
            ->orderBy('published_at', 'desc');

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->get());
    }

    public function show($slug)
    {
        $journal = Journal::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return response()->json($journal);
    }
}
