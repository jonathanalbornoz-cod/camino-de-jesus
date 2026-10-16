@extends('layouts.store')

@section('content')
<section class="hero-section">
    <div class="hero-bg-animated"></div>
    <div class="container hero-content">
        <span class="hero-badge">El Estándar Profesional</span>
        <h1 class="hero-title">Equipamiento Odontológico de <span>Próxima Generación</span></h1>
        <p class="hero-description">Descubre el catálogo más avanzado de insumos dentales. Calidad, precisión y la tecnología que necesitas para potenciar tu clínica.</p>
        <div class="hero-buttons">
            <a href="#catalogo" class="btn btn-primary btn-glow">Explorar Catálogo</a>
            <a href="#" class="btn btn-secondary">Asesoría Especializada</a>
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
                        <span class="product-category">{{ $product->category->name ?? 'Odontología' }}</span>
                    </div>
                    <div class="product-info">
                        <span class="product-brand">{{ $product->brand->name ?? 'Premium' }}</span>
                        <h3 class="product-name" title="{{ $product->name }}">{{ Str::limit($product->name, 45) }}</h3>
                        
                        <div class="product-price-row">
                            <span class="product-price">${{ number_format($product->price, 0, ',', '.') }}</span>
                            @if($product->stock > 0)
                                <span class="badge in-stock">En Stock</span>
                            @else
                                <span class="badge out-of-stock">Agotado</span>
                            @endif
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
