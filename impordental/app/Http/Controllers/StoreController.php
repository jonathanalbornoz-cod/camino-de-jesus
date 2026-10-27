<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;

class StoreController extends Controller
{
    public function index()
    {
        // Todo el catálogo activo; el filtro por categoría se hace en la página.
        $products = Product::where('is_active', true)
                        ->with(['category', 'brand'])
                        ->orderBy('name')
                        ->get();

        $categories = Category::whereHas('products', fn ($q) => $q->where('is_active', true))
                        ->orderBy('name')
                        ->get();

        return view('store.index', compact('categories', 'products'));
    }
}
