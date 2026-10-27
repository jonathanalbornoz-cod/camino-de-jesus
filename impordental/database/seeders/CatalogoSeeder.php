<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CatalogoSeeder extends Seeder
{
    /**
     * Catálogo de Impordental_Listado_60_Productos_Ultradent.xlsx, con las fotos
     * de la carpeta «Pagina Web» convertidas a WebP en imagenes/catalogo.
     *
     * El listado no trae precios ni existencias: los productos entran con precio 0
     * (la tienda muestra «Precio a consultar») y se completan desde /admin.
     * Volver a correrlo no duplica nada ni pisa precios o existencias ya puestos:
     * busca cada producto por su slug y solo actualiza nombre, marca, categoría y foto.
     *
     *   php artisan db:seed --class=CatalogoSeeder --force
     */
    public function run(): void
    {
        $disk = Storage::disk(config('filament.default_filesystem_disk'));

        foreach ($this->productos() as [$marca, $nombre, $categoria, $foto]) {
            $brand = Brand::firstOrCreate(['slug' => Str::slug($marca)], ['name' => $marca]);
            $category = Category::firstOrCreate(['slug' => Str::slug($categoria)], ['name' => $categoria]);

            $imagen = null;
            if ($foto) {
                $imagen = 'products/main/'.$foto;
                $disk->put($imagen, file_get_contents(__DIR__.'/imagenes/catalogo/'.$foto));
            }

            $product = Product::firstOrNew(['slug' => Str::slug($nombre)]);
            $product->fill([
                'name' => $nombre,
                'brand_id' => $brand->id,
                'category_id' => $category->id,
                'main_image' => $imagen ?? $product->main_image,
            ]);
            if (! $product->exists) {
                $product->fill(['price' => 0, 'stock' => 0, 'is_active' => true]);
            }
            $product->save();
        }
    }

    /**
     * [marca, nombre, categoría, foto]
     */
    private function productos(): array
    {
        return [
            // BISCO
            ['BISCO', 'TheraCal LC', 'Cementos', 'theracal-lc.webp'],
            ['BISCO', 'Adhesivo All-Bond Universal', 'Adhesivos', 'adhesivo-all-bond-universal.webp'],
            ['BISCO', 'Cemento Duo-Link Universal', 'Cementos', 'cemento-duo-link-universal.webp'],
            ['BISCO', 'Cemento TheraCem', 'Cementos', 'cemento-theracem.webp'],
            ['BISCO', 'Z-Prime Plus', 'Adhesivos', 'z-prime-plus.webp'],
            ['BISCO', 'Modeling Resin', 'Resinas', 'modeling-resin.webp'],
            ['BISCO', 'ZirClean', 'Grabado y limpieza', 'zirclean.webp'],
            ['BISCO', 'Desmineralizante Select HV', 'Grabado y limpieza', 'desmineralizante-select-hv.webp'],
            ['BISCO', 'Cemento Choice 2', 'Cementos', 'cemento-choice-2.webp'],
            ['BISCO', 'Bis-Silane', 'Adhesivos', 'bis-silane.webp'],

            // FGM
            ['FGM', 'Aclaramiento Whiteness Perfect', 'Aclaramiento dental', 'aclaramiento-whiteness-perfect.webp'],
            ['FGM', 'Aclaramiento Whiteness HP 35%', 'Aclaramiento dental', 'aclaramiento-whiteness-hp-35.webp'],
            ['FGM', 'Adhesivo Ambar', 'Adhesivos', 'adhesivo-ambar.webp'],
            ['FGM', 'Resina Vittra APS', 'Resinas', 'resina-vittra-aps.webp'],
            ['FGM', 'Adhesivo Ambar Universal APS', 'Adhesivos', 'adhesivo-ambar-universal-aps.webp'],
            ['FGM', 'Desmineralizante Condac 37', 'Grabado y limpieza', 'desmineralizante-condac-37.webp'],
            ['FGM', 'Resina Opus Bulk Fill', 'Resinas', 'resina-opus-bulk-fill.webp'],
            ['FGM', 'Cemento Allcem Core', 'Cementos', 'cemento-allcem-core.webp'],
            ['FGM', 'Primma Art', 'Resinas', 'primma-art.webp'],

            // Ivoclar
            ['Ivoclar', 'Resina Tetric N-Ceram 2', 'Resinas', 'resina-tetric-n-ceram-2.webp'],
            ['Ivoclar', 'Resina Tetric N-Flow 2', 'Resinas', 'resina-tetric-n-flow-2.webp'],
            ['Ivoclar', 'Resina Empress Direct', 'Resinas', 'resina-empress-direct.webp'],
            ['Ivoclar', 'Cemento Variolink Esthetic', 'Cementos', 'cemento-variolink-esthetic.webp'],
            ['Ivoclar', 'Cemento Variolink N LC', 'Cementos', 'cemento-variolink-n-lc.webp'],
            ['Ivoclar', 'Adhesivo Tetric N-Bond', 'Adhesivos', 'adhesivo-tetric-n-bond.webp'],
            ['Ivoclar', 'OptraGate', 'Accesorios clínicos', 'optragate.webp'],
            ['Ivoclar', 'Resina Tetric N-Ceram Power Fill', 'Resinas', 'resina-tetric-n-ceram-power-fill.webp'],
            ['Ivoclar', 'Pigmentos Empress Direct Color', 'Resinas', 'pigmentos-empress-direct-color.webp'],
            ['Ivoclar', 'Adhesivo Te-Econom Bond', 'Adhesivos', 'adhesivo-te-econom-bond.webp'],

            // 3M / Solventum
            ['3M / Solventum', 'Resina Filtek Z350 XT', 'Resinas', 'resina-filtek-z350-xt.webp'],
            ['3M / Solventum', 'Resina Filtek Z250', 'Resinas', 'resina-filtek-z250.webp'],
            ['3M / Solventum', 'Adhesivo Single Bond 2', 'Adhesivos', 'adhesivo-single-bond-2.webp'],
            ['3M / Solventum', 'Cemento RelyX U200', 'Cementos', 'cemento-relyx-u200.webp'],
            ['3M / Solventum', 'Discos de pulido Sof-Lex', 'Pulido y acabado', 'discos-de-pulido-sof-lex.webp'],
            ['3M / Solventum', 'Resina Filtek P60', 'Resinas', 'resina-filtek-p60.webp'],
            ['3M / Solventum', 'Resina Filtek One Bulk Fill', 'Resinas', 'resina-filtek-one-bulk-fill.webp'],
            ['3M / Solventum', 'Adhesivo Scotchbond Universal Plus', 'Adhesivos', 'adhesivo-scotchbond-universal-plus.webp'],
            ['3M / Solventum', 'Cemento RelyX Ultimate', 'Cementos', 'cemento-relyx-ultimate.webp'],
            ['3M / Solventum', 'Resina Filtek Bulk Fill Flowable', 'Resinas', 'resina-filtek-bulk-fill-flowable.webp'],

            // Ultradent
            ['Ultradent', 'Aclaramiento Opalescence Boost PF 40%', 'Aclaramiento dental', 'aclaramiento-opalescence-boost-pf-40.webp'],
            ['Ultradent', 'Aclaramiento Opalescence PF', 'Aclaramiento dental', 'aclaramiento-opalescence-pf.webp'],
            ['Ultradent', 'Aclaramiento Opalescence Go', 'Aclaramiento dental', 'aclaramiento-opalescence-go.webp'],
            ['Ultradent', 'Lámpara de fotocurado Valo Grand', 'Lámparas de fotocurado', 'lampara-de-fotocurado-valo-grand.webp'],
            ['Ultradent', 'Lámpara de fotocurado Valo X', 'Lámparas de fotocurado', 'lampara-de-fotocurado-valo-x.webp'],
            ['Ultradent', 'Puntas de pulido Jiffy', 'Pulido y acabado', 'puntas-de-pulido-jiffy.webp'],
            ['Ultradent', 'Barrera Gingival OpalDam Green', 'Aclaramiento dental', 'barrera-gingival-opaldam-green.webp'],
            ['Ultradent', 'Resina Forma', 'Resinas', 'resina-forma.webp'],
            ['Ultradent', 'Adhesivo Peak Universal', 'Adhesivos', 'adhesivo-peak-universal.webp'],

            // Zafiro
            ['Zafiro', 'Unidad odontológica Zafiro', 'Equipos', null],

            // Dentomat
            ['Dentomat', 'Autoclave Automat 3000', 'Equipos', 'autoclave-automat-3000.webp'],

            // Dynair
            ['Dynair', 'Compresor 1 hp Dynair', 'Equipos', 'compresor-1-hp-dynair.webp'],

            // Eighteeth
            ['Eighteeth', 'Lámpara de fotocurado Curing Pen', 'Lámparas de fotocurado', 'lampara-de-fotocurado-curing-pen.webp'],

            // Woodpecker
            ['Woodpecker', 'Lámpara de fotocurado O-Light Max', 'Lámparas de fotocurado', 'lampara-de-fotocurado-o-light-max.webp'],

            // Apple Dental
            ['Apple Dental', 'Kit de piezas Apple Dental', 'Equipos', null],

            // NSK
            ['NSK', 'Kit de piezas NSK', 'Equipos', 'kit-de-piezas-nsk.webp'],

            // American Burs
            ['American Burs', 'Ultra Cut arco y sierra', 'Pulido y acabado', 'ultra-cut-arco-y-sierra.webp'],
            ['American Burs', 'Repuestos Ultra Cut sierra', 'Pulido y acabado', null],
            ['American Burs', 'Ultra Cut manual', 'Pulido y acabado', null],
        ];
    }
}
