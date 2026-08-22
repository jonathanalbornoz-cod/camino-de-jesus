/* ==========================================================================
   comun.js — utilidades compartidas por todas las páginas del sitio
   Convención del proyecto: se usa `const` por defecto y `let` solo cuando
   la variable realmente necesita reasignarse.
   Seguridad: nunca se inyecta HTML con datos dinámicos; siempre textContent.
   ========================================================================== */

'use strict';

const Salsa = (() => {
  /* --- Datos del negocio (ficticios, sitio de demostración) --- */
  const NEGOCIO = Object.freeze({
    nombre: 'Salsamentaría La Sazón Caleña',
    direccion: 'Calle 9 # 44-15, local 2, barrio Tequendama, Cali',
    telefono: '+576025550142',
    whatsapp: '573155550198',
    correo: 'hola@lasazoncalena.co'
  });

  /* Horario semanal. La clave es el día según Date#getDay(): 0 = domingo. */
  const HORARIOS = Object.freeze({
    0: { abre: 8, cierra: 14, texto: '8:00 a.m. a 2:00 p.m.' },
    1: { abre: 7, cierra: 20, texto: '7:00 a.m. a 8:00 p.m.' },
    2: { abre: 7, cierra: 20, texto: '7:00 a.m. a 8:00 p.m.' },
    3: { abre: 7, cierra: 20, texto: '7:00 a.m. a 8:00 p.m.' },
    4: { abre: 7, cierra: 20, texto: '7:00 a.m. a 8:00 p.m.' },
    5: { abre: 7, cierra: 21, texto: '7:00 a.m. a 9:00 p.m.' },
    6: { abre: 7, cierra: 21, texto: '7:00 a.m. a 9:00 p.m.' }
  });

  const NOMBRES_DIA = Object.freeze([
    'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
  ]);

  /* --- Utilidades genéricas --- */

  /** Crea un elemento y le asigna texto de forma segura (nunca HTML). */
  const crear = (etiqueta, clases = '', texto = '') => {
    const elemento = document.createElement(etiqueta);
    if (clases) { elemento.className = clases; }
    if (texto) { elemento.textContent = texto; }
    return elemento;
  };

  /** Formatea un número como pesos colombianos sin decimales. */
  const enPesos = (valor) => {
    const numero = Number.isFinite(valor) ? Math.round(valor) : 0;
    return numero.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    });
  };

  /** Indica si la tienda está abierta en el momento indicado. */
  const estadoTienda = (momento = new Date()) => {
    const dia = momento.getDay();
    const jornada = HORARIOS[dia];
    const horaDecimal = momento.getHours() + momento.getMinutes() / 60;
    const abierto = horaDecimal >= jornada.abre && horaDecimal < jornada.cierra;

    const mensaje = abierto
      ? `Abierto ahora · cerramos a las ${jornada.cierra}:00`
      : `Cerrado · ${NOMBRES_DIA[dia]} atendemos de ${jornada.texto}`;

    return { abierto, mensaje, jornada, dia };
  };

  /** Pinta el indicador "abierto / cerrado" de la barra superior. */
  const pintarEstado = () => {
    const punto = document.getElementById('punto-estado');
    const texto = document.getElementById('estado-texto');
    if (!punto || !texto) { return; }

    const { abierto, mensaje } = estadoTienda();
    texto.textContent = mensaje;
    punto.classList.toggle('punto--cerrado', !abierto);
  };

  /** Resalta la fila del día actual en la tabla de horarios. */
  const resaltarDiaActual = () => {
    const tabla = document.getElementById('tabla-horarios');
    if (!tabla) { return; }

    const hoy = String(new Date().getDay());
    const filas = tabla.querySelectorAll('tr[data-dia]');
    filas.forEach((fila) => {
      fila.classList.toggle('hoy', fila.dataset.dia === hoy);
    });
  };

  /** Menú desplegable para pantallas pequeñas. */
  const activarMenu = () => {
    const boton = document.getElementById('boton-menu');
    const menu = document.getElementById('menu-principal');
    if (!boton || !menu) { return; }

    boton.addEventListener('click', () => {
      const abierto = menu.classList.toggle('abierta');
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    menu.addEventListener('click', (evento) => {
      if (evento.target.tagName === 'A') {
        menu.classList.remove('abierta');
        boton.setAttribute('aria-expanded', 'false');
      }
    });
  };

  /** Año actual en el pie de página. */
  const pintarAnio = () => {
    const destino = document.getElementById('anio');
    if (destino) { destino.textContent = String(new Date().getFullYear()); }
  };

  /* --- Almacenamiento local, siempre protegido y solo en este dispositivo --- */
  const almacen = {
    leer(clave) {
      try {
        const crudo = window.localStorage.getItem(clave);
        const datos = crudo ? JSON.parse(crudo) : [];
        return Array.isArray(datos) ? datos : [];
      } catch (error) {
        return [];
      }
    },
    guardar(clave, datos) {
      try {
        window.localStorage.setItem(clave, JSON.stringify(datos));
        return true;
      } catch (error) {
        return false;
      }
    },
    borrar(clave) {
      try {
        window.localStorage.removeItem(clave);
        return true;
      } catch (error) {
        return false;
      }
    }
  };

  /* --- Arranque común --- */
  document.addEventListener('DOMContentLoaded', () => {
    pintarEstado();
    resaltarDiaActual();
    activarMenu();
    pintarAnio();
    /* Refresca el estado abierto/cerrado cada minuto. */
    window.setInterval(pintarEstado, 60000);
  });

  return { NEGOCIO, HORARIOS, NOMBRES_DIA, crear, enPesos, estadoTienda, almacen };
})();
