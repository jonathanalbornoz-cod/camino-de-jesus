<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    /**
     * Catálogo de ejemplo: el mismo que traía la copia de la base de datos
     * (impordental_database.sql). El usuario administrador no se siembra aquí;
     * se crea con `php artisan make:filament-user` para no dejar una
     * contraseña escrita en el repositorio.
     */
    public function run(): void
    {
        $brand = Brand::firstOrCreate(['slug' => 'colgate'], ['name' => 'Colgate']);
        $category = Category::firstOrCreate(['slug' => 'insumos'], ['name' => 'Insumos']);

        // Las imágenes viven en database/seeders/imagenes porque storage/app/public
        // está fuera de git; aquí se copian al disco público que usa Filament.
        $disk = Storage::disk(config('filament.default_filesystem_disk'));
        $disk->put('products/main/crema-dental.png', file_get_contents(__DIR__.'/imagenes/crema-dental.png'));
        $disk->put('products/gallery/crema-dental-galeria.png', file_get_contents(__DIR__.'/imagenes/crema-dental-galeria.png'));

        Product::updateOrCreate(['slug' => 'crema-dental'], [
            'name' => 'Crema dental',
            'description' => 'LA mejor crema de todas',
            'main_image' => 'products/main/crema-dental.png',
            'images' => ['products/gallery/crema-dental-galeria.png'],
            'price' => 15000,
            'stock' => 30,
            'is_active' => true,
            'category_id' => $category->id,
            'brand_id' => $brand->id,
        ]);
    }
}
