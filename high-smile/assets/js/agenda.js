/**
 * High Smile · Formulario de agendamiento
 * -------------------------------------------------------------
 * Principios aplicados:
 *  - `const` por defecto; `let` solo donde hay reasignación real.
 *  - Minimización de datos: se pide lo mínimo para poder contactar al paciente.
 *  - Sin envíos a terceros: el formulario no expone datos a ningún servidor externo.
 *  - Todo lo que escribe el usuario se inserta con textContent (nunca innerHTML),
 *    de modo que no es posible inyectar HTML ni scripts.
 */
(function () {
  'use strict';

  const formulario = document.getElementById('form-cita');
  if (!formulario) { return; }

  const CLAVE_ALMACEN = 'hs_datos_paciente';
  const WHATSAPP = '573158253729';
  const SALTO = String.fromCharCode(10);

  const pasos = Array.from(formulario.querySelectorAll('.paso-form'));
  const barra = Array.from(document.querySelectorAll('#pasos-barra li'));
  const barraContenedor = document.getElementById('pasos-barra');
  const resumen = document.getElementById('resumen');
  const resumenFinal = document.getElementById('resumen-final');
  const confirmacion = document.getElementById('confirmacion');
  const enlaceWhatsapp = document.getElementById('enlace-whatsapp');
  const campoFecha = document.getElementById('fecha');
  const campoNotas = document.getElementById('notas');
  const contador = document.querySelector('[data-contador]');

  let pasoActual = 0;

  /* ---------------------------------------------------------------
   * Utilidades
   * ------------------------------------------------------------- */
  const traducir = (clave) => (window.HighSmile ? window.HighSmile.t(clave) : clave);

  const contenedorDe = (elemento) => elemento.closest('[data-campo]');

  const marcarError = (elemento, hayError) => {
    const contenedor = contenedorDe(elemento);
    if (contenedor) { contenedor.setAttribute('data-error', String(hayError)); }
    elemento.setAttribute('aria-invalid', String(hayError));
  };

  /* Quita caracteres de control y espacios repetidos antes de mostrar o enviar. */
  const limpiar = (texto) => String(texto || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const soloDigitos = (texto) => String(texto || '').replace(/\D/g, '');

  const valorRadio = (nombre) => {
    const marcado = formulario.querySelector('input[name="' + nombre + '"]:checked');
    if (!marcado) { return ''; }

    const etiqueta = marcado.nextElementSibling;
    return etiqueta ? limpiar(etiqueta.textContent) : marcado.value;
  };

  /* en-CA entrega el formato AAAA-MM-DD, ideal para <input type="date">. */
  const fechaEnCali = (fecha) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(fecha);

  const fechaLegible = (iso) => {
    const partes = String(iso).split('-');
    if (partes.length !== 3) { return iso; }

    const fecha = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
    const region = window.HighSmile && window.HighSmile.idioma() === 'en' ? 'en-GB' : 'es-CO';

    return new Intl.DateTimeFormat(region, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(fecha);
  };

  /* ---------------------------------------------------------------
   * Validaciones por campo
   * ------------------------------------------------------------- */
  const REGLAS = {
    nombre: (valor) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]{3,70}$/.test(limpiar(valor)),
    telefono: (valor) => /^3\d{9}$/.test(soloDigitos(valor).replace(/^57/, '')),
    correo: (valor) => limpiar(valor) === '' || /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(limpiar(valor)),
    servicio: (valor) => valor !== '',
    fecha: (valor) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) { return false; }
      if (valor < fechaEnCali(new Date())) { return false; }

      const partes = valor.split('-');
      const fecha = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
      return fecha.getDay() !== 0; /* los domingos no hay atención */
    },
    autorizacion: (valor, elemento) => elemento.checked
  };

  const validarCampo = (elemento) => {
    const regla = REGLAS[elemento.name];
    if (!regla) { return true; }

    const esValido = regla(elemento.value, elemento);
    marcarError(elemento, !esValido);
    return esValido;
  };

  const validarPaso = (indice) => {
    const campos = Array.from(pasos[indice].querySelectorAll('input, select, textarea'));
    const invalidos = campos.filter((campo) => !validarCampo(campo));

    if (invalidos.length > 0) {
      invalidos[0].focus();
      return false;
    }
    return true;
  };

  /* ---------------------------------------------------------------
   * Resumen (se construye con nodos de texto: a prueba de inyecciones)
   * ------------------------------------------------------------- */
  const datosActuales = () => [
    ['resumen.nombre', limpiar(formulario.nombre.value)],
    ['resumen.celular', soloDigitos(formulario.telefono.value).replace(/^57/, '')],
    ['resumen.correo', limpiar(formulario.correo.value) || traducir('resumen.vacio.correo')],
    ['resumen.paciente', valorRadio('paciente')],
    ['resumen.servicio', limpiar(formulario.servicio.options[formulario.servicio.selectedIndex].textContent)],
    ['resumen.fecha', fechaLegible(formulario.fecha.value)],
    ['resumen.franja', valorRadio('franja')],
    ['resumen.notas', limpiar(formulario.notas.value) || traducir('resumen.vacio.notas')]
  ];

  const pintarResumen = (lista) => {
    if (!lista) { return; }

    lista.textContent = '';

    datosActuales().forEach((par) => {
      const fila = document.createElement('li');
      const titulo = document.createElement('span');
      const valor = document.createElement('strong');

      titulo.textContent = traducir(par[0]);
      valor.textContent = par[1];

      fila.appendChild(titulo);
      fila.appendChild(valor);
      lista.appendChild(fila);
    });
  };

  /* ---------------------------------------------------------------
   * Navegación entre pasos
   * ------------------------------------------------------------- */
  const mostrarPaso = (indice) => {
    pasoActual = Math.min(Math.max(indice, 0), pasos.length - 1);

    pasos.forEach((paso, i) => { paso.hidden = i !== pasoActual; });
    barra.forEach((item, i) => {
      item.classList.toggle('completado', i < pasoActual);
      if (i === pasoActual) {
        item.setAttribute('aria-current', 'step');
      } else {
        item.removeAttribute('aria-current');
      }
    });

    if (pasoActual === pasos.length - 1) { pintarResumen(resumen); }
  };

  /* ---------------------------------------------------------------
   * Código de solicitud (aleatorio, no contiene datos del paciente)
   * ------------------------------------------------------------- */
  const generarCodigo = () => {
    const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const aleatorios = new Uint32Array(6);

    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
      window.crypto.getRandomValues(aleatorios);
    } else {
      aleatorios.forEach((valor, i) => { aleatorios[i] = Math.floor(Math.random() * 4294967295); });
    }

    return 'HS-' + Array.from(aleatorios, (n) => alfabeto[n % alfabeto.length]).join('');
  };

  /* ---------------------------------------------------------------
   * Recordar datos solo en este dispositivo (opt-in explícito)
   * ------------------------------------------------------------- */
  const guardarLocal = () => {
    try {
      const datos = {
        nombre: limpiar(formulario.nombre.value),
        telefono: soloDigitos(formulario.telefono.value),
        correo: limpiar(formulario.correo.value)
      };
      window.localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(datos));
    } catch (error) {
      /* Navegación privada o almacenamiento bloqueado: seguimos sin recordar nada. */
    }
  };

  const borrarLocal = () => {
    try {
      window.localStorage.removeItem(CLAVE_ALMACEN);
    } catch (error) {
      /* No hay nada que borrar. */
    }
  };

  const precargarLocal = () => {
    try {
      const guardado = window.localStorage.getItem(CLAVE_ALMACEN);
      if (!guardado) { return; }

      const datos = JSON.parse(guardado);
      formulario.nombre.value = limpiar(datos.nombre).slice(0, 70);
      formulario.telefono.value = soloDigitos(datos.telefono).slice(0, 12);
      formulario.correo.value = limpiar(datos.correo).slice(0, 90);

      const casilla = document.getElementById('recordar');
      if (casilla) { casilla.checked = true; }
    } catch (error) {
      borrarLocal();
    }
  };

  /* ---------------------------------------------------------------
   * Envío de la solicitud
   * ------------------------------------------------------------- */
  const mensajeWhatsapp = (codigo) => {
    const lineas = [traducir('wa.saludo'), traducir('wa.codigo') + ' ' + codigo];

    datosActuales().forEach((par) => {
      lineas.push(traducir(par[0]) + ': ' + par[1]);
    });

    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lineas.join(SALTO));
  };

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const hayErrores = pasos.some((paso, indice) => !validarPaso(indice));
    if (hayErrores) { return; }

    const codigo = generarCodigo();
    const recordar = document.getElementById('recordar');

    if (recordar && recordar.checked) { guardarLocal(); } else { borrarLocal(); }

    const destinoNombre = document.querySelector('[data-nombre-confirmado]');
    const destinoCodigo = document.querySelector('[data-codigo]');

    if (destinoNombre) { destinoNombre.textContent = limpiar(formulario.nombre.value).split(' ')[0]; }
    if (destinoCodigo) { destinoCodigo.textContent = codigo; }

    pintarResumen(resumenFinal);
    if (enlaceWhatsapp) { enlaceWhatsapp.href = mensajeWhatsapp(codigo); }

    formulario.hidden = true;
    if (barraContenedor) { barraContenedor.hidden = true; }
    confirmacion.hidden = false;
    confirmacion.focus();
    confirmacion.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* ---------------------------------------------------------------
   * Eventos de interfaz
   * ------------------------------------------------------------- */
  document.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-accion]');
    if (!boton) { return; }

    const accion = boton.dataset.accion;

    if (accion === 'siguiente') {
      if (validarPaso(pasoActual)) { mostrarPaso(pasoActual + 1); }
    } else if (accion === 'anterior') {
      mostrarPaso(pasoActual - 1);
    } else if (accion === 'nueva') {
      formulario.reset();
      formulario.hidden = false;
      if (barraContenedor) { barraContenedor.hidden = false; }
      confirmacion.hidden = true;
      formulario.querySelectorAll('[data-error]').forEach((campo) => { campo.removeAttribute('data-error'); });
      precargarLocal();
      mostrarPaso(0);
      formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (accion === 'borrar') {
      borrarLocal();
      formulario.reset();
      boton.textContent = traducir('form.borrado');
      boton.removeAttribute('data-i18n');
      boton.disabled = true;
    }
  });

  formulario.addEventListener('input', (evento) => {
    const elemento = evento.target;
    const contenedor = contenedorDe(elemento);

    if (contenedor && contenedor.getAttribute('data-error') === 'true') { validarCampo(elemento); }
    if (elemento === campoNotas && contador) { contador.textContent = String(campoNotas.value.length); }
  });

  formulario.addEventListener('blur', (evento) => {
    if (evento.target.name && REGLAS[evento.target.name]) { validarCampo(evento.target); }
  }, true);

  /* Si el visitante cambia de idioma, se repinta el resumen visible. */
  document.addEventListener('hs:idioma', () => {
    if (!formulario.hidden && pasoActual === pasos.length - 1) { pintarResumen(resumen); }
    if (confirmacion && !confirmacion.hidden) { pintarResumen(resumenFinal); }
  });

  /* ---------------------------------------------------------------
   * Arranque
   * ------------------------------------------------------------- */
  const iniciar = () => {
    if (campoFecha) {
      const limite = new Date();
      limite.setMonth(limite.getMonth() + 6);

      campoFecha.min = fechaEnCali(new Date());
      campoFecha.max = fechaEnCali(limite);
    }

    precargarLocal();
    mostrarPaso(0);
  };

  iniciar();
}());
