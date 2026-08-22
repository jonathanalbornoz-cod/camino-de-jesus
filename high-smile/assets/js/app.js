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
   * Cada marco fijo declara `data-foto="nombre"` y la galería declara
   * `data-galeria="24"`: se buscan los archivos
   * assets/img/galeria/<nombre>.<ext> y se muestran los que existan.
   * Así, para publicar una foto nueva basta con copiarla en esa carpeta;
   * no hay que tocar el HTML. Las que no existen no dejan hueco.
   * ------------------------------------------------------------- */
  const CARPETA = 'assets/img/galeria/';
  const EXTENSIONES = ['jpg', 'jpeg', 'png', 'webp'];

  /* Los navegadores guardan las imágenes en caché por su dirección. Si se
     reemplaza una foto conservando el nombre, hay que subir este número para
     que todo el mundo vea la nueva y no la que tenía guardada. */
  const VERSION_FOTOS = '3';

  const cargarImagen = (nombre, alExistir, alFaltar) => {
    const probar = (indice) => {
      if (indice >= EXTENSIONES.length) {
        if (alFaltar) { alFaltar(); }
        return;
      }

      const imagen = new Image();
      imagen.onload = () => { alExistir(imagen); };
      imagen.onerror = () => { probar(indice + 1); };
      imagen.src = CARPETA + nombre + '.' + EXTENSIONES[indice] + '?v=' + VERSION_FOTOS;
    };

    probar(0);
  };

  /* Marcos fijos del inicio (por ejemplo la imagen principal). */
  const activarFotos = () => {
    $$('[data-foto]').forEach((marco) => {
      const vacio = $('.marco__vacio', marco);

      cargarImagen(marco.dataset.foto, (imagen) => {
        imagen.alt = vacio ? vacio.textContent.trim() : '';
        marco.insertBefore(imagen, marco.firstChild);
        if (vacio) { vacio.remove(); }
      });
    });
  };

  /* Galería: se recorren los números en orden (galeria-1, galeria-2, …) y se
     publica cada foto encontrada. El recorrido se detiene tras dos números
     seguidos sin archivo, para no pedir imágenes que no existen. */
  const HUECOS_MAXIMOS = 2;

  const activarGaleria = () => {
    const galeria = $('[data-galeria]');
    if (!galeria) { return; }

    const total = Number(galeria.dataset.galeria) || 12;

    const escanear = (numero, huecos) => {
      if (numero > total || huecos > HUECOS_MAXIMOS) { return; }

      const marco = document.createElement('div');
      marco.className = 'marco';
      marco.hidden = true;
      galeria.appendChild(marco);

      cargarImagen('galeria-' + numero, (imagen) => {
        imagen.setAttribute('data-i18n-alt', 'foto.' + numero);
        imagen.alt = window.HighSmile ? window.HighSmile.t('foto.' + numero) : '';
        marco.appendChild(imagen);
        marco.hidden = false;
        escanear(numero + 1, 0);
      }, () => {
        marco.remove();
        escanear(numero + 1, huecos + 1);
      });
    };

    escanear(1, 0);
  };

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
    activarGaleria();
    activarMapa();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
}());
