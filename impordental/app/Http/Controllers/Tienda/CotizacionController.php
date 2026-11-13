<?php

namespace App\Http\Controllers\Tienda;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Carrito de cotización: se arma en la sesión (también sin cuenta) y al
 * enviarlo se guarda como una cotización del cliente, que el equipo responde
 * desde /admin.
 */
class CotizacionController extends Controller
{
    public const SESION = 'cotizacion';

    public function index(Request $request)
    {
        $carrito = $request->session()->get(self::SESION, []);
        $productos = Product::with('brand')
            ->whereIn('id', array_keys($carrito))
            ->where('is_active', true)
            ->get()
            ->map(fn ($p) => tap($p, fn ($p) => $p->cantidad = $carrito[$p->id]));

        // Quien llega aquí sin cuenta vuelve a su cotización después de registrarse o ingresar.
        if ($request->user() === null && $productos->isNotEmpty()) {
            $request->session()->put('url.intended', route('cotizacion'));
        }

        return view('tienda.cotizacion', compact('productos'));
    }

    public function add(Request $request, Product $product)
    {
        abort_unless($product->is_active, 404);

        $request->validate(['cantidad' => ['nullable', 'integer', 'min:1', 'max:999']]);
        $cantidad = (int) $request->input('cantidad', 1);
        $carrito = $request->session()->get(self::SESION, []);
        $carrito[$product->id] = min(999, ($carrito[$product->id] ?? 0) + $cantidad);
        $request->session()->put(self::SESION, $carrito);

        return $this->responder($request, $carrito, $product->name.' se agregó a tu cotización.');
    }

    public function update(Request $request, Product $product)
    {
        $cantidad = (int) $request->validate(['cantidad' => ['required', 'integer', 'min:1', 'max:999']])['cantidad'];
        $carrito = $request->session()->get(self::SESION, []);
        if (isset($carrito[$product->id])) {
            $carrito[$product->id] = $cantidad;
            $request->session()->put(self::SESION, $carrito);
        }

        return $this->responder($request, $carrito, 'Cantidad actualizada.');
    }

    public function remove(Request $request, Product $product)
    {
        $carrito = $request->session()->get(self::SESION, []);
        unset($carrito[$product->id]);
        $request->session()->put(self::SESION, $carrito);

        return $this->responder($request, $carrito, $product->name.' se quitó de tu cotización.');
    }

    public function submit(Request $request)
    {
        $data = $request->validate(['notes' => ['nullable', 'string', 'max:2000']]);
        $carrito = $request->session()->get(self::SESION, []);
        $productos = Product::with('brand')->whereIn('id', array_keys($carrito))->where('is_active', true)->get();

        if ($productos->isEmpty()) {
            return redirect()->route('cotizacion')->with('error', 'Tu cotización está vacía. Agrega productos desde el catálogo.');
        }

        $quote = DB::transaction(function () use ($request, $data, $productos, $carrito) {
            $quote = $request->user()->quotes()->create([
                'status' => 'pendiente',
                'notes' => $data['notes'] ?? null,
            ]);
            foreach ($productos as $p) {
                $quote->items()->create([
                    'product_id' => $p->id,
                    'product_name' => $p->name,
                    'brand_name' => $p->brand->name ?? null,
                    'quantity' => $carrito[$p->id],
                    'unit_price' => $p->price > 0 ? $p->price : null,
                ]);
            }

            return $quote;
        });

        $request->session()->forget(self::SESION);

        return redirect()->route('cuenta.cotizacion', $quote)
            ->with('ok', 'Recibimos tu solicitud '.$quote->number.'. Te responderemos muy pronto.');
    }

    private function responder(Request $request, array $carrito, string $mensaje)
    {
        if ($request->expectsJson()) {
            return response()->json(['count' => count($carrito), 'message' => $mensaje]);
        }

        return back()->with('ok', $mensaje);
    }
}
