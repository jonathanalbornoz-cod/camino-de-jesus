<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- SEO Optimization -->
    <title>Impordental - Insumos y Equipos Odontológicos Premium</title>
    <meta name="description" content="Catálogo avanzado de insumos dentales. Calidad, precisión y tecnología para potenciar tu clínica odontológica en Colombia.">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Premium Styles -->
    <link rel="stylesheet" href="{{ asset('css/store.css') }}">
</head>
<body class="light-theme">
    <header class="glass-header">
        <div class="container header-container">
            <div class="logo">
                <a href="{{ route('home') }}">Impor<span>dental</span></a>
            </div>
            <nav class="nav-links">
                <a href="{{ route('home') }}" class="active">Inicio</a>
                <a href="#catalogo">Catálogo</a>
                <a href="#">Equipos</a>
                <a href="#">Educación</a>
            </nav>
            <div class="header-actions">
                <a href="/admin" class="btn btn-outline" id="btn-portal">Portal Admin</a>
            </div>
        </div>
    </header>

    <main id="main-content">
        @yield('content')
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; {{ date('Y') }} Impordental. Innovación y Precisión para Profesionales de la Salud Dental.</p>
        </div>
    </footer>
</body>
</html>
