/*
 * ajustes.js — correcciones sobre la aplicación compilada.
 *
 * Responde a dos observaciones del cliente que no se pueden arreglar desde los datos
 * y que tampoco justifican reescribir el bundle:
 *
 *   1. El botón de WhatsApp sólo aparecía en la portada, porque vive dentro del
 *      componente app-home. Aquí se añade uno propio, fijo, en el resto de páginas.
 *
 *   2. «Solicitar cotización» en la ficha de producto llevaba al formulario vacío: el
 *      cliente tenía que volver al catálogo y empezar de nuevo. El formulario ya sabe
 *      rellenarse solo —lo hace cuando el carrito tiene algo, y entonces muestra hasta
 *      la foto—, así que basta con dejar el producto en el carrito antes de navegar.
 *
 *   3. El filtro de marca del catálogo era una lista de 43 radios de 1.251 px sin
 *      buscador: encontrar una marca obligaba a recorrer media página. Se le añade un
 *      buscador, el número de productos de cada marca y una altura máxima con scroll.
 *
 * Se carga como script clásico desde index.html, después de offline-api.js.
 */
(function () {
  'use strict';

  var CLAVE_CARRITO = 'agro_cart';
  var SEL_WA_APP = '.fixed.bottom-8.right-8 a[href*="wa.me"]';

  function raiz() {
    var base = document.querySelector('base');
    return base ? base.getAttribute('href') : '/';
  }

  // --- 1. Botón de WhatsApp en todas las páginas ----------------------------

  var boton = null;
  var numero = null;

  function crearBoton() {
    var a = document.createElement('a');
    a.id = 'wa-flotante';
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Escríbenos por WhatsApp');
    a.innerHTML =
      '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">' +
      '<path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z"/>' +
      '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.24 8.21z"/></svg>';
    var s = a.style;
    s.position = 'fixed';
    s.bottom = '2rem';
    s.right = '2rem';
    s.zIndex = '50';
    s.width = '3.5rem';
    s.height = '3.5rem';
    s.borderRadius = '9999px';
    s.display = 'none';
    s.alignItems = 'center';
    s.justifyContent = 'center';
    s.background = '#22c55e';
    s.color = '#fff';
    s.boxShadow = '0 20px 25px -5px rgba(34,197,94,.4)';
    s.transition = 'transform .2s, background-color .2s';
    a.addEventListener('mouseenter', function () {
      a.style.background = '#16a34a';
      a.style.transform = 'scale(1.1)';
    });
    a.addEventListener('mouseleave', function () {
      a.style.background = '#22c55e';
      a.style.transform = 'none';
    });
    document.body.appendChild(a);
    return a;
  }

  // El número sale de los mismos ajustes que usa la aplicación, para que los dos
  // botones apunten siempre al mismo sitio.
  function cargarNumero() {
    return fetch(raiz() + 'data/settings.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (s) {
        numero = ((s && s.whatsapp) || '').replace(/[^0-9]/g, '') || null;
      })
      .catch(function () { numero = null; });
  }

  // En la portada el botón lo pone la aplicación, con su globo de «¿Te ayudo a
  // cotizar?». Ahí no duplicamos: sólo aparecemos donde no está el suyo.
  function revisarBoton() {
    if (!numero) return;
    if (!boton) boton = crearBoton();
    boton.href = 'https://wa.me/' + numero;
    boton.style.display = document.querySelector(SEL_WA_APP) ? 'none' : 'flex';
  }

  // --- 2. «Solicitar cotización» con el producto puesto ---------------------

  var productos = null;

  function cargarProductos() {
    if (productos) return Promise.resolve(productos);
    return fetch(raiz() + 'data/products.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (p) { productos = Array.isArray(p) ? p : []; return productos; })
      .catch(function () { productos = []; return productos; });
  }

  function idDeLaFicha() {
    var m = location.pathname.match(/\/catalogo\/([^/?#]+)$/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function alCarrito(p) {
    var carrito = [];
    try { carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || '[]') || []; } catch (e) { carrito = []; }
    if (!Array.isArray(carrito)) carrito = [];

    var ya = carrito.filter(function (i) { return String(i.id) === String(p.id); })[0];
    if (ya) {
      ya.quantity = (ya.quantity || 1) + 1;
    } else {
      // La misma forma que guarda el carrito de la aplicación.
      carrito.push({
        id: p.id,
        name: p.name,
        price: Number(p.sale_price || p.price || 0),
        cover_image: p.cover_image,
        quantity: 1,
        sku: p.sku,
        brand: p.brand && p.brand.name
      });
    }
    try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito)); } catch (e) { return false; }
    return true;
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest && ev.target.closest('a[href]');
    if (!a) return;
    if (!/\/cotizacion\/?$/.test(a.getAttribute('href') || '')) return;
    if (a.closest('footer')) return;              // el enlace del pie es de navegación, no de un producto

    var id = idDeLaFicha();
    if (!id) return;                              // sólo desde la ficha de un producto

    ev.preventDefault();
    ev.stopPropagation();

    cargarProductos().then(function (lista) {
      var p = lista.filter(function (x) {
        return String(x.id) === id || String(x.slug) === id;
      })[0];
      if (p) alCarrito(p);
      // Recarga completa a propósito: el carrito se lee de localStorage al arrancar
      // la aplicación, así que una navegación interna no vería lo que acabamos de
      // guardar y el formulario volvería a salir vacío.
      location.assign(raiz() + 'cotizacion');
    });
  }, true);

  // --- 3. Buscador dentro del filtro de marcas ------------------------------

  var ID_BUSCADOR = 'filtro-marca-buscador';

  function sinTildes(t) {
    return (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  // Cuántos productos tiene cada marca. La aplicación no lo trae en /brands, así que
  // se cuenta sobre el catálogo ya horneado.
  //
  // La clave es el NOMBRE normalizado, no el slug: los radios del filtro llevan
  // value="on" porque Angular ata el valor al modelo y no al atributo del DOM, así
  // que desde fuera la única forma de saber a qué marca corresponde cada fila es su
  // texto. «Todas» es la excepción: esa sí trae value="".
  var conteos = null;
  function contarPorMarca(lista) {
    if (conteos) return conteos;
    conteos = {};
    lista.forEach(function (p) {
      var nombre = p.brand && p.brand.name;
      if (!nombre) return;
      var k = sinTildes(nombre);
      conteos[k] = (conteos[k] || 0) + 1;
    });
    return conteos;
  }

  function esTodas(label) {
    var input = label.querySelector('input');
    return sinTildes(label.textContent) === 'todas' || (input && input.value === '');
  }

  // El panel de filtros son bloques con un título y una lista .space-y-2 debajo.
  function bloqueDe(titulo) {
    var titulos = document.querySelectorAll('aside p, main p, div > p');
    for (var i = 0; i < titulos.length; i++) {
      var p = titulos[i];
      if (p.children.length === 0 && sinTildes(p.textContent) === sinTildes(titulo)) {
        var lista = p.parentElement && p.parentElement.querySelector('.space-y-2');
        if (lista) return { titulo: p, lista: lista, bloque: p.parentElement };
      }
    }
    return null;
  }

  function aplicarBusqueda(lista, texto) {
    var q = sinTildes(texto);
    var visibles = 0;
    [].forEach.call(lista.querySelectorAll('label'), function (l) {
      var todas = esTodas(l);                       // «Todas» no se filtra nunca
      var coincide = todas || !q || sinTildes(l.textContent).indexOf(q) !== -1;
      l.style.display = coincide ? '' : 'none';
      if (coincide && !todas) visibles++;
    });
    return visibles;
  }

  function montarBuscadorDeMarcas() {
    var b = bloqueDe('MARCA');
    if (!b) return;

    // Números de producto junto a cada marca.
    if (conteos) {
      [].forEach.call(b.lista.querySelectorAll('label'), function (l) {
        if (esTodas(l) || l.querySelector('.marca-conteo')) return;
        var n = conteos[sinTildes(l.textContent)];
        if (!n) return;
        var s = document.createElement('span');
        s.className = 'marca-conteo';
        s.textContent = n;
        s.style.cssText = 'margin-left:auto;font-size:11px;font-weight:700;color:#A08060';
        l.appendChild(s);
      });
    }

    if (document.getElementById(ID_BUSCADOR)) return;   // ya montado

    var caja = document.createElement('div');
    caja.style.cssText = 'margin-bottom:.6rem';

    var input = document.createElement('input');
    input.id = ID_BUSCADOR;
    input.type = 'search';
    input.placeholder = 'Buscar marca…';
    input.setAttribute('aria-label', 'Buscar marca');
    input.style.cssText =
      'width:100%;padding:.45rem .7rem;font-size:13px;color:#3B2A1A;' +
      'border:1px solid #E8DDD0;border-radius:.6rem;background:#fff;outline:none';
    input.addEventListener('focus', function () { input.style.borderColor = '#F36821'; });
    input.addEventListener('blur', function () { input.style.borderColor = '#E8DDD0'; });

    var vacio = document.createElement('p');
    vacio.textContent = 'Ninguna marca coincide.';
    vacio.style.cssText = 'display:none;font-size:12px;color:#A08060;margin:.5rem 0 0';

    input.addEventListener('input', function () {
      var n = aplicarBusqueda(b.lista, input.value);
      vacio.style.display = (input.value && n === 0) ? 'block' : 'none';
    });

    caja.appendChild(input);
    b.bloque.insertBefore(caja, b.lista);
    b.bloque.appendChild(vacio);

    compactar(b.lista, '17rem');
  }

  // Con 43 marcas la lista medía 1.251 px. Y por encima hay otras 29 categorías: sin
  // recortar las dos, el bloque de marcas queda a media página de scroll y el buscador
  // no sirve de nada. Recortarlas devuelve además el sentido al panel sticky, que
  // siendo más alto que la ventana no se quedaba fijo.
  function compactar(lista, alto) {
    if (!lista || lista.dataset.compacta) return;
    lista.dataset.compacta = '1';
    lista.style.maxHeight = alto;
    lista.style.overflowY = 'auto';
    lista.style.paddingRight = '.35rem';
  }

  function compactarCategorias() {
    var c = bloqueDe('CATEGORÍA');
    if (c) compactar(c.lista, '15rem');
  }

  // --- arranque -------------------------------------------------------------

  function iniciar() {
    cargarProductos().then(function (lista) {
      contarPorMarca(lista);
      montarBuscadorDeMarcas();
      compactarCategorias();
    });
    cargarNumero().then(function () {
      revisarBoton();
      // El botón de la aplicación aparece y desaparece al cambiar de ruta. El
      // observador se dispara muchísimo en una SPA, así que se agrupa por fotograma.
      var pendiente = false;
      function revisarPronto() {
        if (pendiente) return;
        pendiente = true;
        requestAnimationFrame(function () {
          pendiente = false;
          revisarBoton();
          montarBuscadorDeMarcas();   // el catálogo se monta y desmonta al navegar
          compactarCategorias();
        });
      }
      new MutationObserver(revisarPronto).observe(document.body, { childList: true, subtree: true });
      window.addEventListener('popstate', revisarPronto);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
