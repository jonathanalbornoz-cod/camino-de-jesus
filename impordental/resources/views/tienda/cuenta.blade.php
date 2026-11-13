@extends('layouts.tienda')

@section('title', 'Mi cuenta · ImporDental')

@section('content')
<section class="page">
    <div class="wrap">
        <header class="page__head page__head--row">
            <div>
                <span class="kicker"><i></i> Mi cuenta</span>
                <h1>Hola, <span class="grad">{{ Str::before(auth()->user()->name, ' ') }}.</span></h1>
                <p>{{ auth()->user()->email }}@if(auth()->user()->company) · {{ auth()->user()->company }}@endif</p>
            </div>
            <form method="POST" action="{{ route('salir') }}">
                @csrf
                <button type="submit" class="btn btn--glass btn--sm">Cerrar sesión</button>
            </form>
        </header>

        <div class="account">
            <div class="account__main">
                <h2 class="account__title">Mis cotizaciones</h2>
                @forelse($quotes as $quote)
                    <a href="{{ route('cuenta.cotizacion', $quote) }}" class="qrow glass">
                        <span class="qrow__num">{{ $quote->number }}</span>
                        <span class="qrow__date">{{ $quote->created_at->format('d/m/Y') }}</span>
                        <span class="qrow__items">{{ $quote->items_count }} {{ $quote->items_count === 1 ? 'producto' : 'productos' }}</span>
                        <span class="status status--{{ $quote->status }}">{{ $quote->status_label }}</span>
                        <svg class="qrow__go" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
                    </a>
                @empty
                    <div class="glass empty-box empty-box--sm">
                        <h3>Aún no has enviado cotizaciones</h3>
                        <p>Agrega productos desde el catálogo y envía tu primera solicitud.</p>
                        <a href="{{ route('home') }}#catalogo" class="btn btn--primary btn--sm">Ir al catálogo</a>
                    </div>
                @endforelse
            </div>
            <aside class="account__side glass">
                <h3>Mi cotización en curso</h3>
                <p>{{ $cotizacionCount ?? 0 }} {{ ($cotizacionCount ?? 0) === 1 ? 'producto agregado' : 'productos agregados' }}</p>
                <a href="{{ route('cotizacion') }}" class="btn btn--primary btn--block btn--sm">Ver cotización</a>
                <hr>
                <h3>¿Necesitas ayuda?</h3>
                <p>Escríbenos desde el formulario de contacto y te respondemos.</p>
                <a href="{{ route('home') }}#contacto" class="btn btn--glass btn--block btn--sm">Contactar</a>
            </aside>
        </div>
    </div>
</section>
@endsection
