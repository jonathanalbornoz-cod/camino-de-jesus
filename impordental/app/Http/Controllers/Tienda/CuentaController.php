<?php

namespace App\Http\Controllers\Tienda;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use Illuminate\Http\Request;

class CuentaController extends Controller
{
    public function index(Request $request)
    {
        $quotes = $request->user()->quotes()->withCount('items')->latest()->get();

        return view('tienda.cuenta', compact('quotes'));
    }

    public function show(Request $request, Quote $quote)
    {
        abort_unless($quote->user_id === $request->user()->id, 404);
        $quote->load('items');

        return view('tienda.cuenta-cotizacion', compact('quote'));
    }
}
