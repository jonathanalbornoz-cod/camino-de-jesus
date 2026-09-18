/*
 * Quesera Chiminangos — comportamiento
 * ------------------------------------------------------------------
 * Pinta el contenido de datos.js, filtra el catálogo y arma el pedido
 * que se envía por WhatsApp. Sin dependencias ni compilación.
 */
(function () {
  'use strict';

  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));

  const PENDIENTE = (v) => !v || String(v).startsWith('PENDIENTE');
  const SIN_NUMERO = !/^\d{8,15}$/.test(String(MARCA.whatsapp || ''));

  const icono = (id) => `<svg aria-hidden="true"><use href="#ic-${id}"></use></svg>`;
  const cat = (id) => CATEGORIAS.find((c) => c.id === id);
  const escapar = (t) => String(t).replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* Quita tildes para que «jamon» encuentre «jamón» */
  const normalizar = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  /* ---------------- Contenido de la marca ---------------- */

  function pintarMarca() {
    // Los campos PENDIENTE se dejan vacíos en vez de mostrarse tal cual
    $$('[data-campo]').forEach((nodo) => {
      const valor = MARCA[nodo.dataset.campo];
      nodo.textContent = PENDIENTE(valor) ? '' : valor;
    });

    if (PENDIENTE(MARCA.direccion)) $('#dato-direccion').hidden = true;
    if (PENDIENTE(MARCA.horario)) $('#dato-horario').hidden = true;

    $('#dato-telefono').innerHTML = MARCA.telefono
      ? `<a href="tel:+57${MARCA.telefono.replace(/\D/g, '')}">${escapar(MARCA.telefono)}</a>` : '';
    const correo = MARCA.correo
      ? `<a href="mailto:${escapar(MARCA.correo)}">${escapar(MARCA.correo)}</a>` : '';
    $('#dato-correo').innerHTML = correo;
    $('#pie-correo').innerHTML = correo;

    $('#anio').textContent = new Date().getFullYear();
    $('#portada-conteo').textContent = PRODUCTOS.length;
    $('#cifra-productos').textContent = PRODUCTOS.length;

    $('#sellos').innerHTML = SELLOS.map((s) => `
      <article class="sello">
        ${icono(s.icono)}
        <h3>${s.titulo}</h3>
        <p>${s.texto}</p>
      </article>`).join('');

    // Redes: sólo se dibujan las que tengan enlace
    const redes = [
      ['instagram', MARCA.instagram, 'Instagram'],
      ['facebook', MARCA.facebook, 'Facebook'],
      ['tiktok', MARCA.tiktok, 'TikTok'],
    ].filter(([, url]) => url);
    if (redes.length) {
      $('#redes').hidden = false;
      $('#redes').innerHTML = redes.map(([id, url, nombre]) =>
        `<a href="${escapar(url)}" target="_blank" rel="noopener" aria-label="${nombre}">${icono(id)}</a>`).join('');
    }

    if (MARCA.mapaEmbed) {
      $('#mapa').hidden = false;
      $('#mapa').innerHTML =
        `<iframe src="${escapar(MARCA.mapaEmbed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                 title="Ubicación de ${MARCA.nombre}" allowfullscreen></iframe>`;
    }

    // Lo que falte de datos.js se avisa por consola, no en pantalla: el aviso
    // es para quien mantiene el sitio, no para el cliente que entra a pedir.
    const faltan = [];
    if (SIN_NUMERO) faltan.push('whatsapp');
    if (PENDIENTE(MARCA.direccion)) faltan.push('direccion');
    if (PENDIENTE(MARCA.horario)) faltan.push('horario');
    if (!MARCA.mapaEmbed) faltan.push('mapaEmbed');
    if (!MARCA.instagram && !MARCA.facebook && !MARCA.tiktok) faltan.push('instagram / facebook / tiktok');
    if (faltan.length) {
      console.warn('[Quesera Chiminangos] Falta por configurar en datos.js: ' + faltan.join(', '));
    }
  }

  /* ---------------- WhatsApp ---------------- */

  function enlaceWa(mensaje) {
    return `https://wa.me/${MARCA.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  }

  const mensajes = {
    general: () => `Hola ${MARCA.nombre}, quiero hacer un pedido. ¿Me ayudan?`,
    mayorista: () => `Hola ${MARCA.nombre}, tengo un negocio y quiero cotizar por mayor. ¿Me ayudan?`,
    producto: (p) =>
      `Hola ${MARCA.nombre}, quiero pedir:\n` +
      `• ${p.nombre}${p.presentacion ? ` (${p.presentacion})` : ''}\n\n` +
      '¿Me confirman disponibilidad y precio?',
    pedido: () =>
      `Hola ${MARCA.nombre}, quiero hacer este pedido:\n\n` +
      pedido.map((id) => {
        const p = PRODUCTOS.find((x) => x.id === id);
        return `• ${p.nombre}${p.presentacion ? ` — ${p.presentacion}` : ''}`;
      }).join('\n') +
      '\n\n¿Me confirman disponibilidad, precio y entrega?',
  };

  function abrirWa(mensaje) {
    if (SIN_NUMERO) {
      alert('El número de WhatsApp todavía no está configurado.\n\nSe define en datos.js, en MARCA.whatsapp.');
      return;
    }
    window.open(enlaceWa(mensaje), '_blank', 'noopener');
  }

  /* ---------------- Filtros ---------------- */

  const estado = { categorias: new Set(), busqueda: '' };

  function pintarFiltros() {
    $('#filtro-categorias').innerHTML = CATEGORIAS.map((c) => {
      const n = PRODUCTOS.filter((p) => p.categoria === c.id).length;
      return `<button type="button" class="ficha" data-id="${c.id}" aria-pressed="false">
                ${icono(c.icono)}${c.nombre} <b>${n}</b>
              </button>`;
    }).join('');

    $('#filtro-categorias').addEventListener('click', (ev) => {
      const ficha = ev.target.closest('.ficha');
      if (!ficha) return;
      const activa = ficha.getAttribute('aria-pressed') === 'true';
      if (activa) estado.categorias.delete(ficha.dataset.id);
      else estado.categorias.add(ficha.dataset.id);
      ficha.setAttribute('aria-pressed', String(!activa));
      pintarCatalogo();
    });

    let temporizador;
    $('#buscar').addEventListener('input', (ev) => {
      const valor = ev.target.value;
      clearTimeout(temporizador);
      temporizador = setTimeout(() => {
        estado.busqueda = normalizar(valor.trim());
        pintarCatalogo();
      }, 140);
    });

    $('#filtros').addEventListener('submit', (ev) => ev.preventDefault());
    $('#limpiar').addEventListener('click', limpiar);
    $$('[data-limpiar]').forEach((b) => b.addEventListener('click', limpiar));
  }

  function limpiar() {
    estado.categorias.clear();
    estado.busqueda = '';
    $('#buscar').value = '';
    $$('.ficha').forEach((f) => f.setAttribute('aria-pressed', 'false'));
    pintarCatalogo();
    $('#catalogo').scrollIntoView({ block: 'start' });
  }

  function filtrar() {
    return PRODUCTOS.filter((p) => {
      if (estado.categorias.size && !estado.categorias.has(p.categoria)) return false;
      if (estado.busqueda) {
        const texto = normalizar([
          p.nombre, p.descripcion, p.presentacion, p.marca || '', cat(p.categoria).nombre,
        ].join(' '));
        if (!texto.includes(estado.busqueda)) return false;
      }
      return true;
    });
  }

  /* ---------------- Catálogo ---------------- */

  function tarjeta(p) {
    const c = cat(p.categoria);
    const marcado = pedido.includes(p.id);
    const figura = p.imagen
      ? `<img src="${p.imagen}" alt="${escapar(p.nombre)}" loading="lazy" width="900" height="1200">`
      : icono(c.icono);

    return `
      <article class="tarjeta">
        <div class="tarjeta__figura${p.imagen ? '' : ' tarjeta__figura--vacia'}">
          ${p.marca ? `<span class="tarjeta__marca">${escapar(p.marca)}</span>` : ''}
          ${p.destacado ? '<span class="tarjeta__insignia">Más pedido</span>' : ''}
          ${figura}
        </div>
        <div class="tarjeta__cuerpo">
          <p class="tarjeta__categoria">${c.nombre}</p>
          <h3 class="tarjeta__nombre">${escapar(p.nombre)}</h3>
          ${p.presentacion ? `<p class="tarjeta__presentacion">${escapar(p.presentacion)}</p>` : ''}
          <p class="tarjeta__descripcion">${escapar(p.descripcion)}</p>
          <div class="tarjeta__acciones">
            <button type="button" class="marcar" data-marcar="${p.id}" aria-pressed="${marcado}">
              ${marcado ? 'Agregado' : 'Agregar'}
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
    // Los destacados arriba; dentro de cada grupo se respeta el orden de datos.js
    lista.sort((a, b) => Number(b.destacado) - Number(a.destacado));

    $('#rejilla').innerHTML = lista.map(tarjeta).join('');
    $('#vacio').hidden = lista.length > 0;

    const total = PRODUCTOS.length;
    $('#conteo').textContent = lista.length === total
      ? `${total} productos en el catálogo`
      : `${lista.length} de ${total} productos`;

    $('#limpiar').hidden = !(estado.categorias.size || estado.busqueda);
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

  function alternar(id) {
    const i = pedido.indexOf(id);
    if (i >= 0) pedido.splice(i, 1);
    else pedido.push(id);
    guardarPedido();
    pintarPedido();
    sincronizarBotones();
  }

  function sincronizarBotones() {
    $$('[data-marcar]').forEach((b) => {
      const dentro = pedido.includes(b.dataset.marcar);
      b.setAttribute('aria-pressed', String(dentro));
      b.textContent = dentro ? 'Agregado' : 'Agregar';
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
    $('#pedido-texto').textContent = pedido.length === 1 ? 'producto en su pedido' : 'productos en su pedido';
    $('#pedido-lista').innerHTML = pedido.map((id) => {
      const p = PRODUCTOS.find((x) => x.id === id);
      return `<li>
          <span>${escapar(p.nombre)}${p.presentacion ? `<br><small>${escapar(p.presentacion)}</small>` : ''}</span>
          <button type="button" class="pedido__quitar" data-quitar="${p.id}"
                  aria-label="Quitar ${escapar(p.nombre)} del pedido">&times;</button>
        </li>`;
    }).join('');
  }

  /* ---------------- Eventos ---------------- */

  function conectar() {
    document.addEventListener('click', (ev) => {
      const marcar = ev.target.closest('[data-marcar]');
      if (marcar) return alternar(marcar.dataset.marcar);

      const quitar = ev.target.closest('[data-quitar]');
      if (quitar) return alternar(quitar.dataset.quitar);

      const producto = ev.target.closest('[data-producto]');
      if (producto) {
        return abrirWa(mensajes.producto(PRODUCTOS.find((x) => x.id === producto.dataset.producto)));
      }

      const wa = ev.target.closest('[data-wa]');
      if (wa) {
        ev.preventDefault();
        const tipo = wa.dataset.wa;
        if (tipo === 'pedido' && pedido.length === 0) return;
        return abrirWa((mensajes[tipo] || mensajes.general)());
      }
    });

    $('#pedido-abrir').addEventListener('click', (ev) => {
      const abierto = ev.currentTarget.getAttribute('aria-expanded') === 'true';
      ev.currentTarget.setAttribute('aria-expanded', String(!abierto));
      $('#pedido-lista').hidden = abierto;
    });

    $('#pedido-vaciar').addEventListener('click', () => {
      pedido = [];
      guardarPedido();
      pintarPedido();
      sincronizarBotones();
    });

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
  conectar();
})();
