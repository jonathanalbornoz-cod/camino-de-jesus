<?php

namespace App\Providers;

use App\Http\Controllers\Tienda\CotizacionController;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Número de productos en la cotización, para el contador del encabezado.
        View::composer(['layouts.tienda', 'tienda.*'], function ($view) {
            $view->with('cotizacionCount', count(session(CotizacionController::SESION, [])));
        });
    }
}
