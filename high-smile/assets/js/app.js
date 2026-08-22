/**
 * High Smile · Comportamiento general del sitio
 * -------------------------------------------------------------
 * Reglas del proyecto:
 *  - `const` por defecto; `let` solo cuando el valor debe reasignarse.
 *  - Sin dependencias externas ni peticiones automáticas a terceros.
 *  - El mapa de Google solo se carga cuando el visitante lo autoriza.
 */
(function () {
  'use strict';

  /* Marca que el JS está activo: sin esta clase el CSS no oculta nada. */
  document.documentElement.classList.add('con-js');

  const $ = (selector, contexto) => (contexto || document).querySelector(selector);
  const $$ = (selector, contexto) => Array.from((contexto || document).querySelectorAll(selector));

  /* ---------------------------------------------------------------
   * Año actual en el pie de página
   * ------------------------------------------------------------- */
  const pintarAnio = () => {
    const anio = String(new Date().getFullYear());
    $$('[data-anio]').forEach((nodo) => { nodo.textContent = anio; });
  };

  /* ---------------------------------------------------------------
   * Menú móvil
   * ------------------------------------------------------------- */
  const activarMenu = () => {
    const boton = $('#menu-boton');
    const nav = $('#nav-principal');
    if (!boton || !nav) { return; }

    const cerrar = () => {
      nav.classList.remove('esta-abierto');
      boton.setAttribute('aria-expanded', 'false');
    };

    boton.addEventListener('click', () => {
      const abierto = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', String(!abierto));
      nav.classList.toggle('esta-abierto', !abierto);
    });

    $$('a', nav).forEach((enlace) => { enlace.addEventListener('click', cerrar); });

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape') { cerrar(); }
    });
  };

  /* ---------------------------------------------------------------
   * Borde de la cabecera al hacer scroll
   * ------------------------------------------------------------- */
  const activarCabecera = () => {
    const cabecera = $('#cabecera');
    if (!cabecera) { return; }

    const actualizar = () => { cabecera.classList.toggle('esta-fija', window.scrollY > 12); };

    actualizar();
    window.addEventListener('scroll', actualizar, { passive: true });
  };

  /* ---------------------------------------------------------------
   * Preguntas frecuentes (acordeón accesible)
   * ------------------------------------------------------------- */
  const activarFaq = () => {
    const contenedor = $('[data-faq]');
    if (!contenedor) { return; }

    const botones = $$('.faq__boton', contenedor);

    botones.forEach((boton) => {
      boton.addEventListener('click', () => {
        const abierto = boton.getAttribute('aria-expanded') === 'true';

        botones.forEach((otro) => {
          const panel = document.getElementById(otro.getAttribute('aria-controls'));
          otro.setAttribute('aria-expanded', 'false');
          if (panel) { panel.hidden = true; }
        });

        if (!abierto) {
          const panel = document.getElementById(boton.getAttribute('aria-controls'));
          boton.setAttribute('aria-expanded', 'true');
          if (panel) { panel.hidden = false; }
        }
      });
    });
  };

  /* ---------------------------------------------------------------
   * Animación de entrada de las secciones
   * ------------------------------------------------------------- */
  const activarRevelado = () => {
    const elementos = $$('.revelar');
    if (elementos.length === 0) { return; }

    if (!('IntersectionObserver' in window)) {
      elementos.forEach((elemento) => { elemento.classList.add('visible'); });
      return;
    }

    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12 });

    elementos.forEach((elemento) => { observador.observe(elemento); });
  };

  /* ---------------------------------------------------------------
   * Fotos de la clínica
   * Cada marco declara `data-foto="nombre"`. Si existe el archivo
   * assets/img/galeria/<nombre>.<ext>, se muestra en lugar del marco vacío.
   * Así basta con copiar las fotos en esa carpeta: no hay que tocar el HTML.
   * Mientras no existan, la consola registra un 404 por intento: es esperado.
   * ------------------------------------------------------------- */
  const EXTENSIONES = ['jpg', 'png', 'webp'];

  const buscarFoto = (marco) => {
    const nombre = marco.dataset.foto;
    const vacio = $('.marco__vacio', marco);
    const alternativo = vacio ? vacio.textContent.trim() : '';

    const probar = (indice) => {
      if (indice >= EXTENSIONES.length) { return; }

      const ruta = 'assets/img/galeria/' + nombre + '.' + EXTENSIONES[indice];
      const imagen = new Image();

      imagen.onload = () => {
        imagen.alt = alternativo;
        marco.insertBefore(imagen, marco.firstChild);
        if (vacio) { vacio.remove(); }
      };
      imagen.onerror = () => { probar(indice + 1); };
      imagen.src = ruta;
    };

    probar(0);
  };

  const activarFotos = () => { $$('[data-foto]').forEach(buscarFoto); };

  /* ---------------------------------------------------------------
   * Mapa bajo consentimiento
   * El iframe de Google solo se crea cuando el visitante lo pide, así
   * que hasta entonces no se hace ninguna petición a terceros.
   * ------------------------------------------------------------- */
  const activarMapa = () => {
    const contenedor = $('[data-mapa]');
    if (!contenedor) { return; }

    const boton = $('[data-mapa-cargar]', contenedor);
    const aviso = $('[data-mapa-aviso]', contenedor);
    if (!boton) { return; }

    boton.addEventListener('click', () => {
      const marco = document.createElement('iframe');

      marco.src = contenedor.dataset.mapaUrl;
      marco.title = contenedor.dataset.mapaTitulo || 'Mapa';
      marco.loading = 'lazy';
      marco.referrerPolicy = 'no-referrer';
      marco.setAttribute('allowfullscreen', '');

      contenedor.appendChild(marco);
      if (aviso) { aviso.remove(); }
    });
  };

  /* ---------------------------------------------------------------
   * Arranque
   * ------------------------------------------------------------- */
  const iniciar = () => {
    pintarAnio();
    activarMenu();
    activarCabecera();
    activarFaq();
    activarRevelado();
    activarFotos();
    activarMapa();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
}());
