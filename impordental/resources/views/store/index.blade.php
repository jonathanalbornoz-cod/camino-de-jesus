@extends('layouts.store')

@section('content')
<section class="hero-corporate">
    <div class="container">
        <div class="hero-banner-box">
            <div class="hero-content-corporate animate-fade-in">
                <span class="hero-tag">Catálogo Premier 2026</span>
                <h1 class="hero-h1">Excelencia en Insumos Odontológicos</h1>
                <p class="hero-p">Distribución premier de equipamiento de alta gama para profesionales que exigen precisión absoluta.</p>
                <div class="btn-group-corporate">
                    <a href="#catalogo" class="btn-solid">Explorar Portafolio</a>
                    <a href="/admin" class="btn-outline">Portal Especialistas</a>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="trust-badges">
    <div class="container badges-container">
        <div class="badge-item">
            <span class="badge-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </span>
            <div class="badge-text">
                <h4>Envío Express</h4>
                <p>Logística nacional prioritaria</p>
            </div>
        </div>
        <div class="badge-item">
            <span class="badge-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </span>
            <div class="badge-text">
                <h4>Garantía Médica</h4>
                <p>Insumos con certificación oficial</p>
            </div>
        </div>
        <div class="badge-item">
            <span class="badge-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </span>
            <div class="badge-text">
                <h4>Transacción Segura</h4>
                <p>Cifrado de grado bancario</p>
            </div>
        </div>
        <div class="badge-item">
            <span class="badge-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </span>
            <div class="badge-text">
                <h4>Asesoría Técnica</h4>
                <p>Soporte por especialistas</p>
            </div>
        </div>
    </div>
</section>

<section id="catalogo" class="products-section">
    <div class="container">
        <div class="section-header">
            <h2>Instrumental y Equipos <span>Destacados</span></h2>
            <p>Selección premium para especialistas exigentes</p>
        </div>

        @if($products->count() > 0)
            <div class="product-grid" id="productGrid">
                @foreach($products as $product)
                <div class="product-card">
                    <div class="product-image">
                        @if($product->main_image)
                            <img src="{{ Storage::url($product->main_image) }}" alt="{{ $product->name }}">
                        @else
                            <div class="image-placeholder">🦷</div>
                        @endif
                    </div>
                    <div class="product-info">
                        <span class="product-brand">{{ $product->brand->name ?? 'Premium' }}</span>
                        <h3 class="product-name" title="{{ $product->name }}">{{ Str::limit($product->name, 50) }}</h3>
                        
                        <div class="product-footer">
                            <div>
                                <span class="product-price">${{ number_format($product->price, 0, ',', '.') }}</span>
                            </div>
                            <a href="#" class="btn-card">Ver Detalles</a>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        @else
            <div class="empty-state" id="emptyState">
                <div class="empty-icon">🦷</div>
                <h3>Aún no hay productos en el catálogo</h3>
                <p>Ingresa al portal administrativo para empezar a registrar equipos, marcas y categorías.</p>
                <a href="/admin" class="btn btn-primary">Ir al Administrador</a>
            </div>
        @endif
    </div>
</section>
@endsection
