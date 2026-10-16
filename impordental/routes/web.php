<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\StoreController;

Route::get('/', [StoreController::class, 'index'])->name('home');
