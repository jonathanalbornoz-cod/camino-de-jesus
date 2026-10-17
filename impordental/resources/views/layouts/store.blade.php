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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- Premium Styles -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="light-theme">
    <!-- Maintenance Overlay v13 -->
    <div id="maintenance-overlay" class="maintenance-overlay" style="display: none;">
        <div class="maint-content">
            <div class="maint-logo">Impor<span>dental</span></div>
            <h2 class="maint-title">Página en Mantenimiento</h2>
            <p class="maint-desc">Estamos preparando el catálogo más avanzado para tu clínica. Por favor, ingresa para ver el progreso.</p>
            
            <div class="maint-form">
                <input type="password" id="maint-pass" class="maint-input" placeholder="••••">
                <button onclick="checkMaintPass()" class="maint-btn">Acceder</button>
            </div>
        </div>
    </div>

    <script>
        // Maintenance logic v13
        (function() {
            const overlay = document.getElementById('maintenance-overlay');
            if (localStorage.getItem('maint_bypass') !== 'granted') {
                overlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        })();

        function checkMaintPass() {
            const pass = document.getElementById('maint-pass').value;
            if (pass === 'j123') {
                localStorage.setItem('maint_bypass', 'granted');
                location.reload();
            } else {
                alert('Contraseña incorrecta');
            }
        }
    </script>
    <div class="top-bar-corporate">
        <div class="container top-bar-flex">
            <div class="top-bar-info">
                <div class="top-bar-item"><span>🚚</span> Envío Prioritario Nacional</div>
                <div class="top-bar-item"><span>🛡️</span> Garantía Técnica Oficial</div>
                <div class="top-bar-item"><span>👨‍⚕️</span> Soporte para Especialistas</div>
            </div>
        </div>
    </div>
    <header class="main-header">
        <div class="container header-flex">
            <div class="logo">
                <a href="{{ route('home') }}" class="corporate-logo">Impor<span>dental</span></a>
            </div>

            <nav class="nav-links">
                <a href="{{ route('home') }}">Inicio</a>
                <a href="#catalogo">Insumos</a>
                <a href="#">Equipos</a>
                <a href="#">Ortodoncia</a>
                <a href="#">Estética</a>
                <a href="#">Ofertas</a>
            </nav>
            
            <div class="header-actions">
                <a href="/admin" class="btn-solid" style="padding: 0.6rem 1.25rem; font-size: 0.75rem;">Portal Profesional</a>
            </div>
        </div>
    </header>

    <main id="main-content">
        @yield('content')
    </main>

    <footer class="footer">
        <div class="footer-container">
            <div>
                <div class="logo" style="margin-bottom: 1.5rem;">
                    <a href="#" style="color: white; font-size: 1.5rem;">Impor<span>dental</span></a>
                </div>
                <p style="font-size: 0.85rem; line-height: 1.8; color: #64748b;">Especialistas en la distribución de insumos y equipamiento dental de alta gama para profesionales exigentes.</p>
            </div>
            <div>
                <h4 style="color: white; margin-bottom: 1.5rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em;">Enlaces Rápidos</h4>
                <ul style="list-style: none; font-size: 0.85rem; line-height: 2.2;">
                    <li><a href="#" style="color: inherit; text-decoration: none; transition: 0.2s;">Sobre Nosotros</a></li>
                    <li><a href="#" style="color: inherit; text-decoration: none; transition: 0.2s;">Catálogo Online</a></li>
                    <li><a href="#" style="color: inherit; text-decoration: none; transition: 0.2s;">Preguntas Frecuentes</a></li>
                    <li><a href="#" style="color: inherit; text-decoration: none; transition: 0.2s;">Blog Dental</a></li>
                </ul>
            </div>
            <div>
                <h4 style="color: white; margin-bottom: 1.5rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em;">Soporte</h4>
                <ul style="list-style: none; font-size: 0.85rem; line-height: 2.2;">
                    <li><a href="#" style="color: inherit; text-decoration: none; transition: 0.2s;">Atención al Cliente</a></li>
                    <li><a href="#" style="color: inherit; text-decoration: none; transition: 0.2s;">Envíos y Entregas</a></li>
                    <li><a href="#" style="color: inherit; text-decoration: none; transition: 0.2s;">Términos y Condiciones</a></li>
                </ul>
            </div>
            <div>
                <h4 style="color: white; margin-bottom: 1.5rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em;">Póngase en contacto</h4>
                <p style="font-size: 0.85rem; line-height: 1.8; color: #64748b;">
                    📍 Calle Comercial #45-67, Bogotá<br>
                    📞 +57 (601) 123 4567<br>
                    📧 contacto@impordental.com
                </p>
            </div>
        </div>
        <div style="max-width: 1400px; margin: 4rem auto 0; padding: 2rem; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
            <p style="font-size: 0.75rem; color: #475569;">&copy; {{ date('Y') }} Impordental Colombia. Todos los derechos reservados.</p>
        </div>
    </footer>
</body>
</html>
