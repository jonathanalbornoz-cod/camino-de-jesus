@extends('layouts.tienda')

@section('title', 'Mi cotización · ImporDental')

@section('content')
<section class="page">
    <div class="wrap">
        <header class="page__head">
            <span class="kicker"><i></i> Cotización</span>
            <h1>Tu <span class="grad">cotización.</span></h1>
            <p>Ajusta las cantidades, cuéntanos lo que necesitas y envíala. Un asesor te responde en tu cuenta.</p>
        </header>

        @if($productos->isEmpty())
            <div class="glass empty-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4h6l1 2h3v14H5V6h3l1-2z"/><path d="M9 12h6M9 16h4"/></svg>
                <h2>Todavía no has agregado productos</h2>
                <p>Recorre el catálogo y pulsa «Cotizar» en los productos que necesitas.</p>
                <a href="{{ route('home') }}#catalogo" class="btn btn--primary">Ir al catálogo</a>
            </div>
        @else
            <div class="quote">
                <ul class="quote__list">
                    @foreach($productos as $p)
                    <li class="quote__item glass">
                        <span class="quote__img">
                            @if($p->main_image)<img src="{{ Storage::url($p->main_image) }}" alt="">@endif
                        </span>
                        <div class="quote__info">
                            <small>{{ $p->brand->name ?? '' }}</small>
                            <strong>{{ $p->name }}</strong>
                        </div>
                        <form method="POST" action="{{ route('cotizacion.actualizar', $p) }}" class="quote__qty">
                            @csrf @method('PATCH')
                            <label class="sr-only" for="qty-{{ $p->id }}">Cantidad</label>
                            <input id="qty-{{ $p->id }}" type="number" name="cantidad" value="{{ $p->cantidad }}" min="1" max="999" onchange="this.form.submit()">
                            <noscript><button type="submit" class="btn btn--glass btn--sm">Actualizar</button></noscript>
                        </form>
                        <form method="POST" action="{{ route('cotizacion.quitar', $p) }}">
                            @csrf @method('DELETE')
                            <button type="submit" class="quote__remove" aria-label="Quitar {{ $p->name }}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
                            </button>
                        </form>
                    </li>
                    @endforeach
                </ul>

                <aside class="quote__side glass">
                    <h2>Resumen</h2>
                    <dl>
                        <div><dt>Productos</dt><dd>{{ $productos->count() }}</dd></div>
                        <div><dt>Unidades</dt><dd>{{ $productos->sum('cantidad') }}</dd></div>
                    </dl>
                    @auth
                        <form method="POST" action="{{ route('cotizacion.enviar') }}">
                            @csrf
                            <label class="field">
                                <span>Comentarios <em>(opcional)</em></span>
                                <textarea name="notes" rows="4" maxlength="2000" placeholder="Referencias, colores, tiempos de entrega, forma de pago…">{{ old('notes') }}</textarea>
                            </label>
                            <button type="submit" class="btn btn--primary btn--block">Enviar cotización</button>
                        </form>
                    @else
                        <p class="quote__note">Para enviar tu cotización necesitas una cuenta. Tus productos se guardan mientras ingresas.</p>
                        <a href="{{ route('registro') }}" class="btn btn--primary btn--block">Crear cuenta y enviar</a>
                        <a href="{{ route('login') }}" class="btn btn--glass btn--block">Ya tengo cuenta</a>
                    @endauth
                    <a href="{{ route('home') }}#catalogo" class="quote__more">+ Agregar más productos</a>
                </aside>
            </div>
        @endif
    </div>
</section>
@endsection
