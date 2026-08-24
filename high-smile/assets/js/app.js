/**
 * High Smile · Comportamiento general del sitio
 * -------------------------------------------------------------
 * Reglas del proyecto:
 *  - `const` por defecto; `let` solo cuando el valor debe reasignarse.
 *  - Sin dependencias externas ni peticiones automáticas a terceros,
 *    salvo el mapa de Google que la clínica pidió ver cargado.
 */
(function () {
  'use strict';

  /* Marca que el JS está activo: sin esta clase el CSS no oculta nada. */
  document.documentElement.classList.add('con-js');

  const $ = (selector, contexto) => (contexto || document).querySelector(selector);
  const $$ = (selector, contexto) => Array.from((contexto || document).querySelectorAll(selector));

  const traducir = (clave) => (window.HighSmile ? window.HighSmile.t(clave) : clave);

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
   * Se buscan los archivos de assets/img/ y se muestran los que existan,
   * así publicar una foto nueva es copiarla en la carpeta.
   * ------------------------------------------------------------- */
  const CARPETA = 'assets/img/';
  const EXTENSIONES = ['jpg', 'png', 'webp'];

  /* Los navegadores guardan las imágenes en caché por su dirección. Si se
     reemplaza una foto conservando el nombre, hay que subir este número para
     que todo el mundo vea la nueva y no la que tenía guardada. */
  const VERSION_FOTOS = '6';

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

  /* Marcos sueltos, como las fotos del equipo. */
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

  /* ---------------------------------------------------------------
   * Carruseles
   * Cada uno declara `data-carrusel="clinica"` y busca las fotos
   * assets/img/fotos/clinica-1, clinica-2, … El recorrido se detiene tras
   * dos números seguidos sin archivo, para no pedir imágenes inexistentes.
   * ------------------------------------------------------------- */
  const HUECOS_MAXIMOS = 1;

  const textoAlternativo = (prefijo, numero) => {
    const especifico = traducir('foto.' + prefijo + '.' + numero);
    return especifico === 'foto.' + prefijo + '.' + numero ? traducir('foto.' + prefijo) : especifico;
  };

  const montarCarrusel = (carrusel) => {
    const prefijo = carrusel.dataset.carrusel;
    const total = Number(carrusel.dataset.total) || 12;
    const pista = $('.carrusel__pista', carrusel);
    const puntos = $('.carrusel__puntos', carrusel);
    if (!pista) { return; }

    const irA = (indice) => {
      const diapositiva = pista.children[indice];
      if (diapositiva) { pista.scrollTo({ left: diapositiva.offsetLeft - pista.offsetLeft, behavior: 'smooth' }); }
    };

    const marcarPunto = () => {
      if (!puntos) { return; }

      const ancho = pista.children.length > 0 ? pista.children[0].offsetWidth + 16 : 1;
      const actual = Math.round(pista.scrollLeft / ancho);

      $$('button', puntos).forEach((punto, i) => {
        punto.setAttribute('aria-selected', String(i === actual));
      });
    };

    const agregarPunto = (indice) => {
      if (!puntos) { return; }

      const punto = document.createElement('button');
      punto.type = 'button';
      punto.className = 'carrusel__punto';
      punto.setAttribute('role', 'tab');
      punto.setAttribute('aria-selected', String(indice === 0));
      punto.addEventListener('click', () => { irA(indice); });
      puntos.appendChild(punto);
    };

    const escanear = (numero, huecos) => {
      if (numero > total || huecos > HUECOS_MAXIMOS) { return; }

      cargarImagen('fotos/' + prefijo + '-' + numero, (imagen) => {
        const diapositiva = document.createElement('div');
        diapositiva.className = 'carrusel__diapositiva';

        imagen.setAttribute('data-i18n-alt', 'foto.' + prefijo + '.' + numero);
        imagen.alt = textoAlternativo(prefijo, numero);
        imagen.loading = 'lazy';

        diapositiva.appendChild(imagen);
        pista.appendChild(diapositiva);
        agregarPunto(pista.children.length - 1);

        escanear(numero + 1, 0);
      }, () => {
        escanear(numero + 1, huecos + 1);
      });
    };

    $$('[data-ir]', carrusel).forEach((boton) => {
      boton.addEventListener('click', () => {
        const ancho = pista.children.length > 0 ? pista.children[0].offsetWidth + 16 : 300;
        pista.scrollBy({ left: ancho * Number(boton.dataset.ir), behavior: 'smooth' });
      });
    });

    pista.addEventListener('scroll', marcarPunto, { passive: true });
    escanear(1, 0);
  };

  const activarCarruseles = () => { $$('[data-carrusel]').forEach(montarCarrusel); };

  /* ---------------------------------------------------------------
   * Envío de fotos del paciente
   * Las imágenes no salen del dispositivo: solo se previsualizan y se
   * preparan los mensajes de WhatsApp y de correo para que el paciente
   * las adjunte. Un envío automático necesitaría un servidor propio.
   * ------------------------------------------------------------- */
  const activarFotosPaciente = () => {
    const zona = $('#campos-fotos');
    if (!zona) { return; }

    const enlaceWa = $('#fotos-whatsapp');
    const enlaceCorreo = $('#fotos-correo');
    const salto = String.fromCharCode(10);

    const elegidas = () => $$('[data-foto-campo]', zona)
      .filter((entrada) => entrada.files && entrada.files.length > 0)
      .map((entrada) => {
        const etiqueta = entrada.closest('.soltar');
        const titulo = etiqueta ? $('.soltar__titulo', etiqueta) : null;
        return titulo ? titulo.textContent.trim() : '';
      });

    const actualizarEnlaces = () => {
      const lista = elegidas();
      const lineas = [traducir('fotos.mensaje')];

      if (lista.length > 0) {
        lineas.push(traducir('fotos.mensaje.adjunto') + ' ' + lista.join(', ') + '.');
      }

      if (enlaceWa) {
        enlaceWa.href = 'https://wa.me/573158253729?text=' + encodeURIComponent(lineas.join(salto));
      }
      if (enlaceCorreo) {
        enlaceCorreo.href = 'mailto:highsmilecali@gmail.com?subject=' +
          encodeURIComponent(traducir('fotos.asunto')) + '&body=' + encodeURIComponent(lineas.join(salto));
      }
    };

    $$('[data-foto-campo]', zona).forEach((entrada) => {
      entrada.addEventListener('change', () => {
        const etiqueta = entrada.closest('.soltar');
        const archivo = entrada.files && entrada.files[0];
        const anterior = etiqueta ? $('.soltar__vista', etiqueta) : null;

        if (anterior) {
          URL.revokeObjectURL(anterior.src);
          anterior.remove();
        }

        if (!archivo || !etiqueta) {
          if (etiqueta) { etiqueta.removeAttribute('data-lista'); }
          actualizarEnlaces();
          return;
        }

        const vista = document.createElement('img');
        vista.className = 'soltar__vista';
        vista.alt = '';
        vista.src = URL.createObjectURL(archivo);

        etiqueta.insertBefore(vista, etiqueta.firstChild);
        etiqueta.setAttribute('data-lista', 'true');
        actualizarEnlaces();
      });
    });

    document.addEventListener('hs:idioma', actualizarEnlaces);
    actualizarEnlaces();
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
    activarCarruseles();
    activarFotosPaciente();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
}());
