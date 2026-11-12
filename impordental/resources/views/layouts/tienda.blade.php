@php
    $waNumero = config('app.whatsapp');
    $waBase = 'https://wa.me/'.($waNumero ?: '');
    $waHola = $waBase.'?text='.rawurlencode('Hola Impordental, quiero hacer una consulta.');
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Impordental · Insumos y equipos odontológicos</title>
    <meta name="description" content="Distribuidor de insumos y equipos odontológicos de BISCO, FGM, Ivoclar, 3M, Ultradent, NSK y más. Cotiza en línea para tu clínica en Colombia.">
    <meta name="theme-color" content="#0f172a">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">

    @vite(['resources/css/tienda.css'])
</head>
<body>
    <header class="t-header" id="inicio">
        <div class="t-wrap t-header__row">
            <a href="{{ route('home') }}" class="t-logo" aria-label="Impordental, inicio">Impor<span>dental</span></a>

            <nav class="t-nav" aria-label="Principal">
                <a href="#categorias">Categorías</a>
                <a href="#catalogo">Catálogo</a>
                <a href="#marcas">Marcas</a>
                <a href="#contacto">Contacto</a>
            </nav>

            <div class="t-header__actions">
                <a href="/admin" class="t-link-admin">Portal profesional</a>
                <a href="{{ $waHola }}" class="t-btn t-btn--primary t-btn--sm" target="_blank" rel="noopener">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>
                    Cotizar
                </a>
            </div>
        </div>
    </header>

    <main>
        @yield('content')
    </main>

    <footer class="t-footer" id="contacto">
        <div class="t-wrap t-footer__grid">
            <div class="t-footer__brand">
                <a href="#inicio" class="t-logo t-logo--light">Impor<span>dental</span></a>
                <p>Insumos y equipos odontológicos de las marcas líderes, con asesoría para clínicas y especialistas en toda Colombia.</p>
            </div>
            <div>
                <h4>Tienda</h4>
                <ul>
                    <li><a href="#categorias">Categorías</a></li>
                    <li><a href="#catalogo">Catálogo completo</a></li>
                    <li><a href="#marcas">Marcas</a></li>
                    <li><a href="/admin">Portal profesional</a></li>
                </ul>
            </div>
            <div>
                <h4>Contacto</h4>
                <ul class="t-footer__contact">
                    <li>Calle Comercial #45-67, Bogotá</li>
                    <li>+57 (601) 123 4567</li>
                    <li><a href="mailto:contacto@impordental.com">contacto@impordental.com</a></li>
                </ul>
            </div>
            <div>
                <h4>Atención</h4>
                <p>¿Tienes dudas sobre un producto o necesitas una cotización? Escríbenos y te asesoramos.</p>
                <a href="{{ $waHola }}" class="t-btn t-btn--ghost-light t-btn--sm" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>
            </div>
        </div>
        <div class="t-wrap t-footer__bottom">
            <span>© {{ date('Y') }} Impordental Colombia</span>
            <span>Todos los derechos reservados</span>
        </div>
    </footer>

    <a href="{{ $waHola }}" class="t-wa-float" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>
    </a>
</body>
</html>
