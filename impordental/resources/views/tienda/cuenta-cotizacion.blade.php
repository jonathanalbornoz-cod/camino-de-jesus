@extends('layouts.tienda')

@section('title', $quote->number.' · ImporDental')

@section('content')
<section class="page">
    <div class="wrap">
        <a href="{{ route('cuenta') }}" class="back">← Mis cotizaciones</a>
        <header class="page__head page__head--row">
            <div>
                <span class="kicker"><i></i> Cotización</span>
                <h1>{{ $quote->number }}</h1>
                <p>Enviada el {{ $quote->created_at->format('d/m/Y \a \l\a\s H:i') }}</p>
            </div>
            <span class="status status--lg status--{{ $quote->status }}">{{ $quote->status_label }}</span>
        </header>

        <div class="account">
            <div class="account__main">
                <div class="glass table-box">
                    <table class="table">
                        <thead><tr><th>Producto</th><th>Marca</th><th class="num">Cantidad</th></tr></thead>
                        <tbody>
                            @foreach($quote->items as $item)
                                <tr><td>{{ $item->product_name }}</td><td>{{ $item->brand_name }}</td><td class="num">{{ $item->quantity }}</td></tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                @if($quote->notes)
                    <div class="glass note-box">
                        <h3>Tus comentarios</h3>
                        <p>{!! nl2br(e($quote->notes)) !!}</p>
                    </div>
                @endif
            </div>
            <aside class="account__side glass">
                <h3>Respuesta de ImporDental</h3>
                @if($quote->response)
                    <p class="response">{!! nl2br(e($quote->response)) !!}</p>
                    @if($quote->responded_at)<small class="muted">{{ $quote->responded_at->format('d/m/Y H:i') }}</small>@endif
                @else
                    <p class="muted">Un asesor está revisando tu solicitud. Verás aquí los precios y la disponibilidad.</p>
                @endif
            </aside>
        </div>
    </div>
</section>
@endsection
