<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SeoController extends Controller
{
    public function index()
    {
        $seos = DB::table('seos')->get();
        return response()->json(['success' => true, 'data' => $seos]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'route' => 'required|string|unique:seos,route',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'keywords' => 'nullable|string',
            'og_image' => 'nullable|string',
        ]);

        $id = DB::table('seos')->insertGetId([
            'route' => $request->route,
            'title' => $request->title,
            'description' => $request->description,
            'keywords' => $request->keywords,
            'og_image' => $request->og_image,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $seo = DB::table('seos')->where('id', $id)->first();
        return response()->json(['success' => true, 'message' => 'SEO configuration saved.', 'data' => $seo]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'route' => 'required|string|unique:seos,route,'.$id,
            'title' => 'required|string',
            'description' => 'nullable|string',
            'keywords' => 'nullable|string',
            'og_image' => 'nullable|string',
        ]);

        DB::table('seos')->where('id', $id)->update([
            'route' => $request->route,
            'title' => $request->title,
            'description' => $request->description,
            'keywords' => $request->keywords,
            'og_image' => $request->og_image,
            'updated_at' => now(),
        ]);

        $seo = DB::table('seos')->where('id', $id)->first();
        return response()->json(['success' => true, 'message' => 'SEO configuration updated.', 'data' => $seo]);
    }

    public function destroy($id)
    {
        DB::table('seos')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'SEO configuration deleted.']);
    }
}
