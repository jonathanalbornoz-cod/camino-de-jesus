@extends('layouts.tienda')

@php
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
<section class="hero">
    <div class="wrap hero__grid">
        <div class="hero__copy">
            <span class="kicker"><i></i> Equipos y materiales odontológicos</span>
            <h1>La odontología del futuro <span class="grad">empieza con el material correcto.</span></h1>
            <p class="hero__lead">Distribuimos BISCO, FGM, Ivoclar, 3M, Ultradent y NSK. Crea tu cuenta, arma tu cotización en minutos y recibe respuesta de un asesor especializado.</p>

            <div class="hero__actions">
                <a href="#catalogo" class="btn btn--primary">
                    Explorar catálogo
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
                @guest
                    <a href="{{ route('registro') }}" class="btn btn--glass">Crear cuenta gratis</a>
                @else
                    <a href="{{ route('cotizacion') }}" class="btn btn--glass">Ver mi cotización</a>
                @endguest
            </div>

            <dl class="hero__stats">
                <div><dt>{{ $products->count() }}</dt><dd>productos</dd></div>
                <div><dt>{{ $brands->count() }}</dt><dd>marcas líderes</dd></div>
                <div><dt>{{ $categories->count() }}</dt><dd>categorías</dd></div>
            </dl>
        </div>

        <div class="hero__visual" aria-hidden="true">
            <div class="orb">
                <span class="orb__ring orb__ring--1"></span>
                <span class="orb__ring orb__ring--2"></span>
                <span class="orb__core">
                    <svg viewBox="0 0 64 64" fill="none"><path d="M21 7C10.5 7 5.6 15 6.8 24c1 7.6 4.2 11.8 5.3 19.6C13.2 51.8 15.4 58 19.6 58c4.3 0 5.4-9.6 8.6-13.6 1.3-1.6 2.5-2.4 3.8-2.4s2.5.8 3.8 2.4c3.2 4 4.3 13.6 8.6 13.6 4.2 0 6.4-6.2 7.5-14.4 1.1-7.8 4.3-12 5.3-19.6C58.4 15 53.5 7 43 7c-5 0-7.6 3.2-11 3.2S26 7 21 7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                </span>
            </div>
            @foreach($destacados as $i => $p)
            <figure class="float-card float-card--{{ $i + 1 }}">
                <span class="float-card__img"><img src="{{ Storage::url($p->main_image) }}" alt=""></span>
                <figcaption><small>{{ $p->brand->name ?? '' }}</small>{{ Str::limit($p->name, 30) }}</figcaption>
            </figure>
            @endforeach
        </div>
    </div>
</section>

{{-- Marcas --}}
<section class="brands" aria-label="Marcas que distribuimos">
    <div class="brands__track">
        @foreach([1, 2] as $vuelta)
            <ul @if($vuelta === 2) aria-hidden="true" @endif>
                @foreach($brands as $brand)
                    <li>{{ $brand }}</li>
                @endforeach
            </ul>
        @endforeach
    </div>
</section>

{{-- Categorías --}}
<section class="section" id="categorias">
    <div class="wrap">
        <header class="section__head">
            <span class="kicker"><i></i> Categorías</span>
            <h2>Todo tu consultorio, <span class="grad">en un solo lugar.</span></h2>
        </header>
        <div class="cats">
            @foreach($categories as $category)
            <a href="#catalogo" class="cat glass" data-go-filter="{{ $category->slug }}">
                <span class="cat__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">{!! $iconos[$category->slug] ?? $diente !!}</svg>
                </span>
                <span class="cat__name">{{ $category->name }}</span>
                <span class="cat__count">{{ $category->products_count }} {{ $category->products_count === 1 ? 'producto' : 'productos' }}</span>
                <svg class="cat__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>
            </a>
            @endforeach
        </div>
    </div>
</section>

{{-- Catálogo --}}
<section class="section" id="catalogo">
    <div class="wrap">
        <header class="section__head section__head--row">
            <div>
                <span class="kicker"><i></i> Catálogo</span>
                <h2>Agrega productos <span class="grad">y cotiza en línea.</span></h2>
            </div>
            <label class="search glass">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                <input type="search" id="buscar" placeholder="Buscar producto o marca" autocomplete="off" aria-label="Buscar producto o marca">
            </label>
        </header>

        @if($products->count())
            <div class="chips" role="group" aria-label="Filtrar por categoría">
                <button type="button" class="chip is-active" data-filter="todas">Todas <span>{{ $products->count() }}</span></button>
                @foreach($categories as $category)
                <button type="button" class="chip" data-filter="{{ $category->slug }}">{{ $category->name }} <span>{{ $category->products_count }}</span></button>
                @endforeach
            </div>

            <div class="grid" id="productGrid">
                @foreach($products as $product)
                <article class="card" data-category="{{ $product->category->slug ?? '' }}" data-search="{{ Str::lower(Str::ascii($product->name.' '.($product->brand->name ?? ''))) }}">
                    <div class="card__media">
                        @if($product->main_image)
                            <img src="{{ Storage::url($product->main_image) }}" alt="{{ $product->name }}" loading="lazy">
                        @else
                            <svg class="card__placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{!! $diente !!}</svg>
                        @endif
                    </div>
                    <div class="card__body">
                        <div class="card__meta">
                            <span class="card__brand">{{ $product->brand->name ?? 'ImporDental' }}</span>
                            @if($product->category)<span class="card__cat">{{ $product->category->name }}</span>@endif
                        </div>
                        <h3 class="card__name">{{ $product->name }}</h3>
                        <div class="card__foot">
                            @if($product->price > 0)
                                <span class="card__price">${{ number_format($product->price, 0, ',', '.') }}</span>
                            @else
                                <span class="card__price card__price--ask">Precio a cotizar</span>
                            @endif
                            <form method="POST" action="{{ route('cotizacion.agregar', $product) }}" data-add-quote>
                                @csrf
                                <button type="submit" class="card__add" aria-label="Agregar {{ $product->name }} a la cotización">
                                    <svg class="i-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                                    <svg class="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>
                                    <span>Cotizar</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </article>
                @endforeach
            </div>
            <p class="empty" id="sinResultados" hidden>No encontramos productos con esa búsqueda. <a href="#contacto">Escríbenos</a> y te ayudamos a conseguirlo.</p>
        @else
            <p class="empty">Aún no hay productos en el catálogo.</p>
        @endif
    </div>
</section>

{{-- Cómo funciona --}}
<section class="section" id="como-funciona">
    <div class="wrap">
        <header class="section__head section__head--center">
            <span class="kicker"><i></i> Cómo cotizar</span>
            <h2>Tres pasos. <span class="grad">Cero complicaciones.</span></h2>
        </header>
        <ol class="steps">
            <li class="step glass">
                <span class="step__num">01</span>
                <h3>Crea tu cuenta</h3>
                <p>Regístrate con tu correo y una contraseña. Solo toma un minuto.</p>
            </li>
            <li class="step glass">
                <span class="step__num">02</span>
                <h3>Arma tu cotización</h3>
                <p>Agrega productos del catálogo, ajusta cantidades y déjanos tus comentarios.</p>
            </li>
            <li class="step glass">
                <span class="step__num">03</span>
                <h3>Recibe la respuesta</h3>
                <p>Un asesor revisa tu solicitud y te responde con precios y disponibilidad en tu cuenta.</p>
            </li>
        </ol>
    </div>
</section>

{{-- Contacto --}}
<section class="section" id="contacto">
    <div class="wrap contact">
        <div class="contact__info">
            <span class="kicker"><i></i> Contacto</span>
            <h2>Hablemos de <span class="grad">tu clínica.</span></h2>
            <p>¿Buscas un producto que no está en el catálogo o necesitas asesoría técnica? Escríbenos y un especialista te responde.</p>
            <ul class="contact__list">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>Calle Comercial #45-67, Bogotá</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>+57 (601) 123 4567</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>contacto@impordental.com</li>
            </ul>
        </div>

        <form method="POST" action="{{ route('contacto') }}" class="form glass">
            @csrf
            @if(session('contacto_ok'))
                <div class="flash flash--inline" role="status">{{ session('contacto_ok') }}</div>
            @endif
            <div class="form__row">
                <label class="field">
                    <span>Nombre</span>
                    <input type="text" name="name" value="{{ old('name', auth()->user()->name ?? '') }}" required maxlength="255" autocomplete="name">
                    @error('name')<small class="field__error">{{ $message }}</small>@enderror
                </label>
                <label class="field">
                    <span>Correo</span>
                    <input type="email" name="email" value="{{ old('email', auth()->user()->email ?? '') }}" required maxlength="255" autocomplete="email">
                    @error('email')<small class="field__error">{{ $message }}</small>@enderror
                </label>
            </div>
            <div class="form__row">
                <label class="field">
                    <span>Teléfono <em>(opcional)</em></span>
                    <input type="tel" name="phone" value="{{ old('phone', auth()->user()->phone ?? '') }}" maxlength="30" autocomplete="tel">
                </label>
                <label class="field">
                    <span>Asunto <em>(opcional)</em></span>
                    <input type="text" name="subject" value="{{ old('subject') }}" maxlength="255">
                </label>
            </div>
            <label class="field">
                <span>Mensaje</span>
                <textarea name="message" rows="5" required maxlength="3000">{{ old('message') }}</textarea>
                @error('message')<small class="field__error">{{ $message }}</small>@enderror
            </label>
            <label class="hp" aria-hidden="true">No llenar <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
            <button type="submit" class="btn btn--primary btn--block">Enviar mensaje</button>
        </form>
    </div>
</section>

<script>
(function () {
    var grid = document.getElementById('productGrid');
    if (!grid) return;
    var cards = grid.querySelectorAll('.card');
    var chips = document.querySelectorAll('.chip');
    var buscar = document.getElementById('buscar');
    var vacio = document.getElementById('sinResultados');
    var filtro = 'todas';

    function normalizar(t) { return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

    function aplicar() {
        var q = normalizar(buscar.value.trim());
        var visibles = 0;
        cards.forEach(function (card) {
            var ok = (filtro === 'todas' || card.dataset.category === filtro) && (!q || card.dataset.search.indexOf(q) !== -1);
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
    chips.forEach(function (chip) { chip.addEventListener('click', function () { elegir(chip.dataset.filter); }); });
    document.querySelectorAll('[data-go-filter]').forEach(function (a) { a.addEventListener('click', function () { elegir(a.dataset.goFilter); }); });
    buscar.addEventListener('input', aplicar);
})();
</script>
@endsection
