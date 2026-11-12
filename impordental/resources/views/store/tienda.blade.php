@extends('layouts.tienda')

@php
    $waBase = 'https://wa.me/'.(config('app.whatsapp') ?: '');

    // Íconos de línea (24×24) para cada categoría; las que no estén usan el diente.
    $iconos = [
        'resinas' => '<path d="M14 4l6 6-9 9H5v-6l9-9z"/><path d="M12 6l6 6"/>',
        'adhesivos' => '<path d="M9 3h6v4l2 3v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V10l2-3V3z"/><path d="M7 13h10"/>',
        'cementos' => '<path d="M5 8h14l-1.5 12h-11L5 8z"/><path d="M8 8a4 4 0 0 1 8 0"/>',
        'aclaramiento-dental' => '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/>',
        'lamparas-de-fotocurado' => '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5V16h8v-2.5A6 6 0 0 0 12 3z"/>',
        'equipos' => '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h4M7 14h2M15 10.5h2v3h-2z"/>',
        'grabado-y-limpieza' => '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
        'pulido-y-acabado' => '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
        'accesorios-clinicos' => '<path d="M4 7h16v10H4z"/><path d="M9 7V5h6v2"/>',
    ];
    $diente = '<path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 5 2 8 .4 2.5 1 5.5 2.5 5.5S9.5 17 12 17s3 4 4.5 4 2.1-3 2.5-5.5c.5-3 2-5 2-8C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z"/>';
@endphp

@section('content')
{{-- Portada --}}
<section class="t-hero">
    <div class="t-wrap t-hero__grid">
        <div class="t-hero__copy">
            <span class="t-eyebrow">Distribuidor odontológico · Colombia</span>
            <h1>Todo lo que tu clínica necesita, <em>de las marcas en las que confías.</em></h1>
            <p>Resinas, adhesivos, cementos, aclaramiento y equipos de BISCO, FGM, Ivoclar, 3M, Ultradent y NSK, con asesoría de especialistas y envío a todo el país.</p>

            <div class="t-hero__actions">
                <a href="#catalogo" class="t-btn t-btn--primary">Ver catálogo</a>
                <a href="{{ $waBase }}?text={{ rawurlencode('Hola Impordental, quiero una cotización para mi clínica.') }}" class="t-btn t-btn--ghost-light" target="_blank" rel="noopener">Cotizar por WhatsApp</a>
            </div>

            <dl class="t-hero__stats">
                <div><dt>{{ $products->count() }}</dt><dd>productos</dd></div>
                <div><dt>{{ $brands->count() }}</dt><dd>marcas</dd></div>
                <div><dt>{{ $categories->count() }}</dt><dd>categorías</dd></div>
            </dl>
        </div>

        @if($destacados->count())
        <div class="t-hero__showcase" aria-hidden="true">
            @foreach($destacados as $i => $p)
            <figure class="t-hero__card t-hero__card--{{ $i + 1 }}">
                <img src="{{ Storage::url($p->main_image) }}" alt="">
                <figcaption><span>{{ $p->brand->name ?? '' }}</span>{{ Str::limit($p->name, 32) }}</figcaption>
            </figure>
            @endforeach
        </div>
        @endif
    </div>
</section>

{{-- Marcas --}}
<section class="t-brands" id="marcas" aria-label="Marcas que distribuimos">
    <div class="t-wrap">
        <p class="t-brands__label">Marcas que distribuimos</p>
        <ul class="t-brands__list">
            @foreach($brands as $brand)
                <li>{{ $brand }}</li>
            @endforeach
        </ul>
    </div>
</section>

{{-- Categorías --}}
<section class="t-section" id="categorias">
    <div class="t-wrap">
        <div class="t-section__head">
            <span class="t-eyebrow t-eyebrow--dark">Explora por categoría</span>
            <h2>Encuentra rápido lo que buscas</h2>
        </div>
        <div class="t-cats">
            @foreach($categories as $category)
            <a href="#catalogo" class="t-cat" data-go-filter="{{ $category->slug }}">
                <span class="t-cat__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{!! $iconos[$category->slug] ?? $diente !!}</svg>
                </span>
                <span class="t-cat__name">{{ $category->name }}</span>
                <span class="t-cat__count">{{ $category->products_count }} {{ $category->products_count === 1 ? 'producto' : 'productos' }}</span>
            </a>
            @endforeach
        </div>
    </div>
</section>

{{-- Catálogo --}}
<section class="t-section t-section--tint" id="catalogo">
    <div class="t-wrap">
        <div class="t-section__head t-section__head--row">
            <div>
                <span class="t-eyebrow t-eyebrow--dark">Catálogo</span>
                <h2>Instrumental, insumos y equipos</h2>
            </div>
            <label class="t-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                <input type="search" id="buscar" placeholder="Buscar producto o marca" autocomplete="off" aria-label="Buscar producto o marca">
            </label>
        </div>

        @if($products->count())
            <div class="t-chips" role="group" aria-label="Filtrar por categoría">
                <button type="button" class="t-chip is-active" data-filter="todas">Todas <span>{{ $products->count() }}</span></button>
                @foreach($categories as $category)
                <button type="button" class="t-chip" data-filter="{{ $category->slug }}">{{ $category->name }} <span>{{ $category->products_count }}</span></button>
                @endforeach
            </div>

            <div class="t-grid" id="productGrid">
                @foreach($products as $product)
                <article class="t-card" data-category="{{ $product->category->slug ?? '' }}" data-search="{{ Str::lower(Str::ascii($product->name.' '.($product->brand->name ?? ''))) }}">
                    <div class="t-card__media">
                        @if($product->main_image)
                            <img src="{{ Storage::url($product->main_image) }}" alt="{{ $product->name }}" loading="lazy">
                        @else
                            <svg class="t-card__placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{!! $diente !!}</svg>
                        @endif
                        @if($product->category)
                            <span class="t-card__tag">{{ $product->category->name }}</span>
                        @endif
                    </div>
                    <div class="t-card__body">
                        <span class="t-card__brand">{{ $product->brand->name ?? 'Impordental' }}</span>
                        <h3 class="t-card__name">{{ $product->name }}</h3>
                        <div class="t-card__foot">
                            @if($product->price > 0)
                                <span class="t-card__price">${{ number_format($product->price, 0, ',', '.') }}</span>
                            @else
                                <span class="t-card__price t-card__price--ask">Precio a consultar</span>
                            @endif
                            <a href="{{ $waBase }}?text={{ rawurlencode('Hola Impordental, quiero cotizar: '.$product->name.' ('.($product->brand->name ?? '').')') }}" class="t-card__cta" target="_blank" rel="noopener" aria-label="Cotizar {{ $product->name }} por WhatsApp">
                                Cotizar
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                            </a>
                        </div>
                    </div>
                </article>
                @endforeach
            </div>
            <p class="t-empty" id="sinResultados" hidden>No encontramos productos con esa búsqueda. Escríbenos y te ayudamos a conseguirlo.</p>
        @else
            <p class="t-empty">Aún no hay productos en el catálogo. Ingresa al <a href="/admin">portal profesional</a> para registrarlos.</p>
        @endif
    </div>
</section>

{{-- Ventajas --}}
<section class="t-section">
    <div class="t-wrap t-perks">
        <div class="t-perk">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="6" width="14" height="11" rx="1"/><path d="M15 10h4l3 3v4h-7z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>
            <h3>Envío nacional</h3>
            <p>Despachamos a clínicas y consultorios en toda Colombia.</p>
        </div>
        <div class="t-perk">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            <h3>Productos originales</h3>
            <p>Insumos con garantía oficial de las marcas que distribuimos.</p>
        </div>
        <div class="t-perk">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <h3>Asesoría especializada</h3>
            <p>Te ayudamos a elegir el material indicado para cada caso.</p>
        </div>
        <div class="t-perk">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
            <h3>Pago seguro</h3>
            <p>Compra con confianza, con pagos protegidos de principio a fin.</p>
        </div>
    </div>
</section>

{{-- Llamado final --}}
<section class="t-wrap">
    <div class="t-cta">
        <div>
            <h2>¿Necesitas una cotización para tu clínica?</h2>
            <p>Envíanos tu lista de productos y te respondemos con precios y disponibilidad.</p>
        </div>
        <a href="{{ $waBase }}?text={{ rawurlencode('Hola Impordental, quiero enviar mi lista de productos para cotizar.') }}" class="t-btn t-btn--light" target="_blank" rel="noopener">Hablar con un asesor</a>
    </div>
</section>

<script>
(function () {
    var grid = document.getElementById('productGrid');
    if (!grid) return;
    var cards = grid.querySelectorAll('.t-card');
    var chips = document.querySelectorAll('.t-chip');
    var buscar = document.getElementById('buscar');
    var vacio = document.getElementById('sinResultados');
    var filtro = 'todas';

    function normalizar(t) {
        return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    function aplicar() {
        var q = normalizar(buscar.value.trim());
        var visibles = 0;
        cards.forEach(function (card) {
            var ok = (filtro === 'todas' || card.dataset.category === filtro)
                && (!q || card.dataset.search.indexOf(q) !== -1);
            card.hidden = !ok;
            if (ok) visibles++;
        });
        vacio.hidden = visibles !== 0;
    }

    function elegir(slug) {
        filtro = slug;
        chips.forEach(function (c) { c.classList.toggle('is-active', c.dataset.filter === slug); });
        aplicar();
    }

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () { elegir(chip.dataset.filter); });
    });
    document.querySelectorAll('[data-go-filter]').forEach(function (a) {
        a.addEventListener('click', function () { elegir(a.dataset.goFilter); });
    });
    buscar.addEventListener('input', aplicar);
})();
</script>
@endsection
