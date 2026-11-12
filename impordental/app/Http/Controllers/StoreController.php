<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;

class StoreController extends Controller
{
    /**
     * Productos que protagonizan la portada, si existen y tienen foto.
     */
    private const DESTACADOS = [
        'lampara-de-fotocurado-valo-grand',
        'aclaramiento-opalescence-boost-pf-40',
        'resina-filtek-z350-xt',
        'kit-de-piezas-nsk',
    ];

    public function index()
    {
        // Todo el catálogo activo; el filtro por categoría y la búsqueda se hacen en la página.
        $products = Product::where('is_active', true)
                        ->with(['category', 'brand'])
                        ->orderBy('name')
                        ->get();

        $categories = Category::whereHas('products', fn ($q) => $q->where('is_active', true))
                        ->withCount(['products' => fn ($q) => $q->where('is_active', true)])
                        ->orderBy('name')
                        ->get();

        $brands = Brand::whereHas('products', fn ($q) => $q->where('is_active', true))
                        ->orderBy('name')
                        ->pluck('name');

        $destacados = $products->whereIn('slug', self::DESTACADOS)
                        ->whereNotNull('main_image')
                        ->sortBy(fn ($p) => array_search($p->slug, self::DESTACADOS))
                        ->values();
        if ($destacados->count() < 4) {
            $destacados = $destacados->concat(
                $products->whereNotNull('main_image')->whereNotIn('id', $destacados->pluck('id'))
            )->take(4)->values();
        }

        return view('store.tienda', compact('categories', 'products', 'brands', 'destacados'));
    }
}
