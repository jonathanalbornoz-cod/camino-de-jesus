@php
    $waNumero = config('app.whatsapp');
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'ImporDental · Equipos y materiales odontológicos')</title>
    <meta name="description" content="ImporDental: equipos y materiales odontológicos de BISCO, FGM, Ivoclar, 3M, Ultradent, NSK y más. Crea tu cuenta y cotiza en línea para tu clínica.">
    <meta name="theme-color" content="#050b1f">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    @vite(['resources/css/tienda.css'])
</head>
<body class="@yield('body_class')">
    <div class="bg-fx" aria-hidden="true"><span class="bg-fx__grid"></span><span class="bg-fx__orb bg-fx__orb--1"></span><span class="bg-fx__orb bg-fx__orb--2"></span></div>

    <header class="nav" id="inicio">
        <div class="wrap nav__row">
            <a href="{{ route('home') }}" class="nav__brand" aria-label="ImporDental, inicio">
                @include('tienda.partials.logo', ['compact' => true])
            </a>

            <nav class="nav__links" aria-label="Principal">
                <a href="{{ route('home') }}#categorias">Categorías</a>
                <a href="{{ route('home') }}#catalogo">Catálogo</a>
                <a href="{{ route('home') }}#como-funciona">Cómo cotizar</a>
                <a href="{{ route('home') }}#contacto">Contacto</a>
            </nav>

            <div class="nav__actions">
                <a href="{{ route('cotizacion') }}" class="nav__quote" aria-label="Mi cotización">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4h6l1 2h3v14H5V6h3l1-2z"/><path d="M9 12h6M9 16h4"/></svg>
                    <span class="nav__quote-label">Cotización</span>
                    <span class="nav__badge" data-quote-count @if(! $cotizacionCount) hidden @endif>{{ $cotizacionCount }}</span>
                </a>
                @auth
                    <a href="{{ route('cuenta') }}" class="btn btn--glass btn--sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>
                        <span>{{ Str::before(auth()->user()->name, ' ') }}</span>
                    </a>
                @else
                    <a href="{{ route('login') }}" class="nav__login">Ingresar</a>
                    <a href="{{ route('registro') }}" class="btn btn--primary btn--sm">Crear cuenta</a>
                @endauth
            </div>
        </div>
    </header>

    @if(session('ok') || session('error'))
        <div class="wrap">
            <div class="flash {{ session('error') ? 'flash--error' : '' }}" role="status">{{ session('ok') ?? session('error') }}</div>
        </div>
    @endif

    <main>
        @yield('content')
    </main>

    <footer class="foot">
        <div class="wrap foot__grid">
            <div class="foot__brand">
                @include('tienda.partials.logo')
                <p>Equipos y materiales odontológicos de las marcas líderes, con asesoría para clínicas y especialistas en toda Colombia.</p>
            </div>
            <div>
                <h4>Tienda</h4>
                <ul>
                    <li><a href="{{ route('home') }}#catalogo">Catálogo</a></li>
                    <li><a href="{{ route('home') }}#categorias">Categorías</a></li>
                    <li><a href="{{ route('cotizacion') }}">Mi cotización</a></li>
                    <li><a href="{{ route('home') }}#contacto">Contacto</a></li>
                </ul>
            </div>
            <div>
                <h4>Tu cuenta</h4>
                <ul>
                    @auth
                        <li><a href="{{ route('cuenta') }}">Mis cotizaciones</a></li>
                    @else
                        <li><a href="{{ route('login') }}">Ingresar</a></li>
                        <li><a href="{{ route('registro') }}">Crear cuenta</a></li>
                    @endauth
                    <li><a href="/admin">Portal administrativo</a></li>
                </ul>
            </div>
            <div>
                <h4>Contacto</h4>
                <ul class="foot__contact">
                    <li>Calle Comercial #45-67, Bogotá</li>
                    <li>+57 (601) 123 4567</li>
                    <li><a href="mailto:contacto@impordental.com">contacto@impordental.com</a></li>
                </ul>
            </div>
        </div>
        <div class="wrap foot__bottom">
            <span>© {{ date('Y') }} ImporDental Colombia</span>
            <span>Equipos y materiales odontológicos</span>
        </div>
    </footer>

    @if($waNumero)
        <a href="https://wa.me/{{ $waNumero }}?text={{ rawurlencode('Hola ImporDental, quiero hacer una consulta.') }}" class="wa-float" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>
        </a>
    @endif

    <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>

    <script>
    // Agregar a la cotización sin recargar la página. Sin JavaScript, el formulario se envía normal.
    (function () {
        var token = document.querySelector('meta[name="csrf-token"]').content;
        var toast = document.getElementById('toast');
        var timer;
        function avisar(texto) {
            toast.textContent = texto; toast.hidden = false;
            requestAnimationFrame(function () { toast.classList.add('is-on'); });
            clearTimeout(timer);
            timer = setTimeout(function () { toast.classList.remove('is-on'); setTimeout(function () { toast.hidden = true; }, 300); }, 2600);
        }
        document.addEventListener('submit', function (e) {
            var form = e.target.closest('form[data-add-quote]');
            if (!form) return;
            e.preventDefault();
            var boton = form.querySelector('button');
            boton.disabled = true;
            fetch(form.action, { method: 'POST', headers: { 'X-CSRF-TOKEN': token, 'Accept': 'application/json' }, body: new FormData(form) })
                .then(function (r) { if (!r.ok) throw r; return r.json(); })
                .then(function (data) {
                    document.querySelectorAll('[data-quote-count]').forEach(function (b) { b.textContent = data.count; b.hidden = data.count === 0; });
                    boton.classList.add('is-added');
                    setTimeout(function () { boton.classList.remove('is-added'); }, 1600);
                    avisar(data.message);
                })
                .catch(function () { form.submit(); })
                .finally(function () { boton.disabled = false; });
        });
    })();
    </script>
</body>
</html>
