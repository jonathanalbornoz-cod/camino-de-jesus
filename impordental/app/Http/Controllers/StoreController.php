<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

class StoreController extends Controller
{
    public function index()
    {
        // En un caso real, optimizaríamos esto. Aquí solo mostramos los activos con relaciones cargadas.
        $categories = Category::all();
        $products = Product::where('is_active', true)
                        ->with(['category', 'brand'])
                        ->latest()
                        ->take(12)
                        ->get();
                        
        return view('store.index', compact('categories', 'products'));
    }
}
