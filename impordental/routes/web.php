<?php

use App\Http\Controllers\StoreController;
use App\Http\Controllers\Tienda\AuthController;
use App\Http\Controllers\Tienda\ContactoController;
use App\Http\Controllers\Tienda\CotizacionController;
use App\Http\Controllers\Tienda\CuentaController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StoreController::class, 'index'])->name('home');

// Cuentas de clientes
Route::middleware('guest')->group(function () {
    Route::get('/ingresar', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/ingresar', [AuthController::class, 'login'])->middleware('throttle:20,1');
    Route::get('/registro', [AuthController::class, 'showRegister'])->name('registro');
    Route::post('/registro', [AuthController::class, 'register'])->middleware('throttle:10,1');
});
Route::post('/salir', [AuthController::class, 'logout'])->middleware('auth')->name('salir');

// Cotización: se arma sin cuenta, se envía con cuenta
Route::get('/cotizacion', [CotizacionController::class, 'index'])->name('cotizacion');
Route::post('/cotizacion/productos/{product}', [CotizacionController::class, 'add'])->name('cotizacion.agregar');
Route::patch('/cotizacion/productos/{product}', [CotizacionController::class, 'update'])->name('cotizacion.actualizar');
Route::delete('/cotizacion/productos/{product}', [CotizacionController::class, 'remove'])->name('cotizacion.quitar');
Route::post('/cotizacion/enviar', [CotizacionController::class, 'submit'])->middleware('auth')->name('cotizacion.enviar');

// Área del cliente
Route::middleware('auth')->group(function () {
    Route::get('/mi-cuenta', [CuentaController::class, 'index'])->name('cuenta');
    Route::get('/mi-cuenta/cotizaciones/{quote}', [CuentaController::class, 'show'])->name('cuenta.cotizacion');
});

Route::post('/contacto', [ContactoController::class, 'store'])->middleware('throttle:5,1')->name('contacto');
