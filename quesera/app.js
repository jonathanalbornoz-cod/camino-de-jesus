/*
 * Quesera Chiminangos — comportamiento
 * ------------------------------------------------------------------
 * Tres cosas: pintar el contenido de datos.js, filtrar el catálogo y
 * armar el pedido que se envía por WhatsApp.
 *
 * Sin dependencias ni compilación: se abre el index.html y funciona.
 */
(function () {
  'use strict';

  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));

  /* El número todavía sin configurar: la página lo avisa en vez de callarlo */
  const SIN_NUMERO = !/^\d{8,15}$/.test(String(MARCA.whatsapp || ''));

  const iconoDe = (id) => `<svg aria-hidden="true"><use href="#ic-${id}"></use></svg>`;
  const catPorId = (id) => CATEGORIAS.find((c) => c.id === id);
  const etiquetaPorId = (id) => ETIQUETAS.find((e) => e.id === id);

  /* Quita tildes para que «jamon» encuentre «jamón» */
  const normalizar = (texto) =>
    String(texto).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  /* ---------------- Contenido de la marca ---------------- */

  function pintarMarca() {
    $$('[data-campo]').forEach((nodo) => {
      const valor = MARCA[nodo.dataset.campo];
      nodo.textContent = valor && valor !== 'PENDIENTE' ? valor : '';
    });

    const marca = $('#logo-marca');
    const sello = $('#sello-grande');
    if (MARCA.logo) {
      marca.innerHTML = `<img src="${MARCA.logo}" alt="Logotipo de ${MARCA.nombre}">`;
      sello.innerHTML = `<img src="${MARCA.logo}" alt="">`;
    } else {
      // Sello tipográfico de respaldo mientras no esté el logotipo original
      marca.innerHTML =
        '<svg viewBox="0 0 64 64" aria-hidden="true">' +
        '<circle cx="32" cy="32" r="30" fill="#2F4A36"/>' +
        '<circle cx="32" cy="32" r="25" fill="none" stroke="#E8C98A" stroke-width="1.5"/>' +
        '<text x="32" y="39" text-anchor="middle" font-family="Georgia,serif" font-size="24" fill="#FBF7EF">QC</text>' +
        '</svg>';
      sello.innerHTML =
        '<div class="sello-grande__texto">' +
        '<b>Quesera</b><i>Chiminangos</i>' +
        `<span>${MARCA.eslogan}</span>` +
        '</div>';
    }

    $('#anio').textContent = new Date().getFullYear();

    $('#sellos').innerHTML = SELLOS.map((s) => `
      <article class="sello">
        ${iconoDe(s.icono)}
        <h3>${s.titulo}</h3>
        <p>${s.texto}</p>
      </article>`).join('');

    if (SIN_NUMERO) {
      const aviso = $('#aviso-config');
      aviso.hidden = false;
      aviso.innerHTML =
        'Falta configurar el número de WhatsApp: cámbielo en <code>datos.js</code> ' +
        '(<code>MARCA.whatsapp</code>) y este aviso desaparece solo.';
    }
  }

  /* ---------------- Enlaces de WhatsApp ---------------- */

  function enlaceWhatsApp(mensaje) {
    if (SIN_NUMERO) return null;
    return `https://wa.me/${MARCA.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  }

  function mensajeGeneral() {
    return `Hola ${MARCA.nombre}, quiero hacer un pedido. ¿Me ayudan?`;
  }

  function mensajeProducto(producto) {
    return (
      `Hola ${MARCA.nombre}, quiero pedir:\n` +
      `• ${producto.nombre} (${producto.presentacion})\n\n` +
      '¿Me confirman disponibilidad y precio?'
    );
  }

  function mensajePedido() {
    const lineas = pedido.map((id) => {
      const p = PRODUCTOS.find((x) => x.id === id);
      return `• ${p.nombre} — ${p.presentacion}`;
    });
    return (
      `Hola ${MARCA.nombre}, quiero hacer este pedido:\n\n` +
      lineas.join('\n') +
      '\n\n¿Me confirman disponibilidad, precio y hora de entrega?'
    );
  }

  /* Los enlaces con data-wa se resuelven al hacer clic, con el pedido al día */
  function conectarEnlacesWa() {
    document.addEventListener('click', (ev) => {
      const enlace = ev.target.closest('[data-wa]');
      if (!enlace) return;
      ev.preventDefault();

      if (SIN_NUMERO) {
        alert(
          'El número de WhatsApp todavía no está configurado.\n\n' +
          'Se define en datos.js, en MARCA.whatsapp.'
        );
        return;
      }

      const tipo = enlace.dataset.wa;
      if (tipo === 'pedido' && pedido.length === 0) return;
      const mensaje = tipo === 'pedido' ? mensajePedido() : mensajeGeneral();
      window.open(enlaceWhatsApp(mensaje), '_blank', 'noopener');
    });
  }

  /* ---------------- Filtros ---------------- */

  const estado = { categorias: new Set(), etiquetas: new Set(), busqueda: '' };

  function pintarFiltros() {
    $('#filtro-categorias').innerHTML = CATEGORIAS.map((c) => `
      <button type="button" class="ficha" data-tipo="categoria" data-id="${c.id}" aria-pressed="false">
        ${iconoDe(c.icono)}${c.nombre}
      </button>`).join('');

    $('#filtro-etiquetas').innerHTML = ETIQUETAS.map((e) => `
      <button type="button" class="ficha" data-tipo="etiqueta" data-id="${e.id}" aria-pressed="false">
        ${e.nombre}
      </button>`).join('');

    $('#filtros').addEventListener('click', (ev) => {
      const ficha = ev.target.closest('.ficha');
      if (!ficha) return;
      const conjunto = ficha.dataset.tipo === 'categoria' ? estado.categorias : estado.etiquetas;
      const activa = ficha.getAttribute('aria-pressed') === 'true';
      if (activa) conjunto.delete(ficha.dataset.id);
      else conjunto.add(ficha.dataset.id);
      ficha.setAttribute('aria-pressed', String(!activa));
      pintarCatalogo();
    });

    let temporizador;
    $('#buscar').addEventListener('input', (ev) => {
      clearTimeout(temporizador);
      const valor = ev.target.value;
      temporizador = setTimeout(() => {
        estado.busqueda = normalizar(valor.trim());
        pintarCatalogo();
      }, 140);
    });

    $('#limpiar').addEventListener('click', limpiarFiltros);
    $$('[data-limpiar]').forEach((b) => b.addEventListener('click', limpiarFiltros));
  }

  function limpiarFiltros() {
    estado.categorias.clear();
    estado.etiquetas.clear();
    estado.busqueda = '';
    $('#buscar').value = '';
    $$('.ficha').forEach((f) => f.setAttribute('aria-pressed', 'false'));
    pintarCatalogo();
    $('#catalogo').scrollIntoView({ block: 'start' });
  }

  function filtrar() {
    return PRODUCTOS.filter((p) => {
      if (estado.categorias.size && !estado.categorias.has(p.categoria)) return false;
      // Las etiquetas se acumulan: el producto debe tenerlas todas
      for (const et of estado.etiquetas) {
        if (!p.etiquetas.includes(et)) return false;
      }
      if (estado.busqueda) {
        const texto = normalizar(
          [p.nombre, p.descripcion, p.presentacion, catPorId(p.categoria).nombre].join(' ')
        );
        if (!texto.includes(estado.busqueda)) return false;
      }
      return true;
    });
  }

  /* ---------------- Catálogo ---------------- */

  function tarjeta(p) {
    const cat = catPorId(p.categoria);
    const marcado = pedido.includes(p.id);
    const figura = p.imagen
      ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy">`
      : iconoDe(cat.icono);

    return `
      <article class="tarjeta" id="p-${p.id}">
        <div class="tarjeta__figura">
          ${figura}
          ${p.destacado ? '<span class="tarjeta__insignia">Los más pedidos</span>' : ''}
        </div>
        <div class="tarjeta__cuerpo">
          <p class="tarjeta__categoria">${cat.nombre}</p>
          <h3 class="tarjeta__nombre">${p.nombre}</h3>
          <p class="tarjeta__descripcion">${p.descripcion}</p>
          <div class="tarjeta__etiquetas">
            ${p.etiquetas.map((id) => `<span class="etiqueta">${etiquetaPorId(id).nombre}</span>`).join('')}
          </div>
          <p class="tarjeta__presentacion"><b>Se vende por:</b> ${p.presentacion}</p>
          <div class="tarjeta__acciones">
            <button type="button" class="marcar" data-marcar="${p.id}" aria-pressed="${marcado}">
              ${marcado ? 'En el pedido' : 'Agregar'}
            </button>
            <button type="button" class="boton boton--wa" data-producto="${p.id}">
              <svg class="ic" aria-hidden="true"><use href="#ic-whatsapp"></use></svg>
              Pedir
            </button>
          </div>
        </div>
      </article>`;
  }

  function pintarCatalogo() {
    const lista = filtrar();
    // Los destacados primero, el resto en el orden de datos.js
    lista.sort((a, b) => Number(b.destacado) - Number(a.destacado));

    $('#rejilla').innerHTML = lista.map(tarjeta).join('');
    $('#vacio').hidden = lista.length > 0;

    const total = PRODUCTOS.length;
    $('#conteo').textContent =
      lista.length === total
        ? `${total} productos en el catálogo`
        : `${lista.length} de ${total} productos`;

    const hayFiltros = estado.categorias.size || estado.etiquetas.size || estado.busqueda;
    $('#limpiar').hidden = !hayFiltros;
  }

  /* ---------------- El pedido ---------------- */

  const CLAVE = 'quesera-chiminangos-pedido';
  let pedido = [];

  function cargarPedido() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      // Se descartan los ids que ya no existan en el catálogo
      pedido = guardado.filter((id) => PRODUCTOS.some((p) => p.id === id));
    } catch (e) {
      pedido = [];
    }
  }

  function guardarPedido() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(pedido));
    } catch (e) {
      /* modo privado o almacenamiento lleno: el pedido vive sólo en memoria */
    }
  }

  function alternarProducto(id) {
    const i = pedido.indexOf(id);
    if (i >= 0) pedido.splice(i, 1);
    else pedido.push(id);
    guardarPedido();
    pintarPedido();
    sincronizarBotones();
  }

  function sincronizarBotones() {
    $$('[data-marcar]').forEach((boton) => {
      const dentro = pedido.includes(boton.dataset.marcar);
      boton.setAttribute('aria-pressed', String(dentro));
      boton.textContent = dentro ? 'En el pedido' : 'Agregar';
    });
  }

  function pintarPedido() {
    const barra = $('#pedido');
    const hay = pedido.length > 0;

    barra.hidden = !hay;
    document.body.classList.toggle('con-pedido', hay);
    if (!hay) {
      $('#pedido-lista').hidden = true;
      $('#pedido-abrir').setAttribute('aria-expanded', 'false');
      return;
    }

    $('#pedido-contador').textContent = String(pedido.length);
    $('#pedido-lista').innerHTML = pedido.map((id) => {
      const p = PRODUCTOS.find((x) => x.id === id);
      return `
        <li>
          <span>${p.nombre}<br><small>${p.presentacion}</small></span>
          <button type="button" class="pedido__quitar" data-quitar="${p.id}"
                  aria-label="Quitar ${p.nombre} del pedido">&times;</button>
        </li>`;
    }).join('');
  }

  function conectarPedido() {
    document.addEventListener('click', (ev) => {
      const marcar = ev.target.closest('[data-marcar]');
      if (marcar) { alternarProducto(marcar.dataset.marcar); return; }

      const quitar = ev.target.closest('[data-quitar]');
      if (quitar) { alternarProducto(quitar.dataset.quitar); return; }

      const pedir = ev.target.closest('[data-producto]');
      if (pedir) {
        if (SIN_NUMERO) {
          alert('El número de WhatsApp todavía no está configurado.\n\nSe define en datos.js, en MARCA.whatsapp.');
          return;
        }
        const p = PRODUCTOS.find((x) => x.id === pedir.dataset.producto);
        window.open(enlaceWhatsApp(mensajeProducto(p)), '_blank', 'noopener');
      }
    });

    $('#pedido-abrir').addEventListener('click', (ev) => {
      const lista = $('#pedido-lista');
      const abierto = ev.currentTarget.getAttribute('aria-expanded') === 'true';
      ev.currentTarget.setAttribute('aria-expanded', String(!abierto));
      lista.hidden = abierto;
    });

    $('#pedido-vaciar').addEventListener('click', () => {
      pedido = [];
      guardarPedido();
      pintarPedido();
      sincronizarBotones();
    });
  }

  /* ---------------- Menú móvil ---------------- */

  function conectarMenu() {
    const boton = $('#menu-boton');
    const menu = $('#menu');
    boton.addEventListener('click', () => {
      const abierto = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', String(!abierto));
      menu.classList.toggle('abierto', !abierto);
    });
    menu.addEventListener('click', (ev) => {
      if (ev.target.closest('a')) {
        boton.setAttribute('aria-expanded', 'false');
        menu.classList.remove('abierto');
      }
    });
  }

  /* ---------------- Arranque ---------------- */

  cargarPedido();
  pintarMarca();
  pintarFiltros();
  pintarCatalogo();
  pintarPedido();
  conectarPedido();
  conectarEnlacesWa();
  conectarMenu();
})();
