/**
 * Sonrisa Pacífico · Comportamiento general del sitio
 * -------------------------------------------------------------
 * Reglas del proyecto:
 *  - `const` por defecto; `let` solo cuando el valor debe reasignarse.
 *  - Sin dependencias externas ni peticiones a terceros.
 *  - Nada de datos personales en este archivo.
 */
(function () {
  'use strict';

  /* Marca que el JS está activo: sin esta clase el CSS no oculta nada. */
  document.documentElement.classList.add('con-js');

  /* ---------------------------------------------------------------
   * Utilidades
   * ------------------------------------------------------------- */
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
   * Sombra de la cabecera al hacer scroll
   * ------------------------------------------------------------- */
  const activarCabecera = () => {
    const cabecera = $('#cabecera');
    if (!cabecera) { return; }

    const actualizar = () => {
      cabecera.classList.toggle('esta-fija', window.scrollY > 12);
    };

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
   * Testimonios rotativos
   * ------------------------------------------------------------- */
  const activarTestimonios = () => {
    const seccion = $('.testimonios');
    if (!seccion) { return; }

    const tarjetas = $$('.testimonio', seccion);
    const puntos = $$('.punto', seccion);
    if (tarjetas.length === 0) { return; }

    let indiceActual = 0;
    let temporizador = 0;

    const mostrar = (indice) => {
      indiceActual = (indice + tarjetas.length) % tarjetas.length;

      tarjetas.forEach((tarjeta, i) => {
        const esActiva = i === indiceActual;
        tarjeta.classList.toggle('esta-activo', esActiva);
        tarjeta.hidden = !esActiva;
      });

      puntos.forEach((punto, i) => {
        punto.setAttribute('aria-selected', String(i === indiceActual));
      });
    };

    const detener = () => { window.clearInterval(temporizador); };
    const arrancar = () => {
      detener();
      temporizador = window.setInterval(() => { mostrar(indiceActual + 1); }, 7000);
    };

    puntos.forEach((punto) => {
      punto.addEventListener('click', () => {
        mostrar(Number(punto.dataset.indice));
        arrancar();
      });
    });

    seccion.addEventListener('mouseenter', detener);
    seccion.addEventListener('mouseleave', arrancar);
    seccion.addEventListener('focusin', detener);

    mostrar(0);

    const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefiereMenosMovimiento) { arrancar(); }
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
    }, { threshold: 0.15 });

    elementos.forEach((elemento) => { observador.observe(elemento); });
  };

  /* ---------------------------------------------------------------
   * Estado «Abierto / Cerrado» según la hora de Cali (America/Bogota)
   * ------------------------------------------------------------- */
  const HORARIO = {
    /* dia: [minutoApertura, minutoCierre] en minutos desde medianoche */
    1: [420, 1140], 2: [420, 1140], 3: [420, 1140], 4: [420, 1140], 5: [420, 1140],
    6: [480, 840],
    0: null
  };

  const horaEnCali = () => {
    const formateador = new Intl.DateTimeFormat('es-CO', {
      timeZone: 'America/Bogota',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const partes = formateador.formatToParts(new Date());
    const valor = (tipo) => {
      const parte = partes.find((p) => p.type === tipo);
      return parte ? parte.value : '';
    };

    const dias = { dom: 0, lun: 1, mar: 2, mié: 3, mie: 3, jue: 4, vie: 5, sáb: 6, sab: 6 };
    const claveDia = valor('weekday').toLowerCase().replace('.', '').slice(0, 3);

    return {
      dia: typeof dias[claveDia] === 'number' ? dias[claveDia] : new Date().getDay(),
      minutos: (Number(valor('hour')) * 60) + Number(valor('minute'))
    };
  };

  const activarEstado = () => {
    const contenedor = $('[data-estado]');
    if (!contenedor) { return; }

    const texto = $('[data-estado-texto]', contenedor);
    const ahora = horaEnCali();
    const franja = HORARIO[ahora.dia];
    const abierto = Boolean(franja) && ahora.minutos >= franja[0] && ahora.minutos < franja[1];

    contenedor.classList.toggle('estado--cerrado', !abierto);
    if (!texto) { return; }

    texto.textContent = abierto
      ? 'Abierto ahora · te atendemos hoy mismo'
      : 'Cerrado ahora · agenda en línea las 24 horas';
  };

  /* ---------------------------------------------------------------
   * Arranque
   * ------------------------------------------------------------- */
  const iniciar = () => {
    pintarAnio();
    activarMenu();
    activarCabecera();
    activarFaq();
    activarTestimonios();
    activarRevelado();
    activarEstado();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
}());
