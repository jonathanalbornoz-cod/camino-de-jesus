/*
 * offline-api.js — sirve el contenido del sitio desde archivos locales.
 *
 * La aplicación está compilada y pide sus datos a api.agroforestaldecolombia.com.
 * Este script intercepta esas peticiones y las responde con los JSON de data/,
 * de modo que la copia publicada no dependa del backend.
 *
 * Regla: si no hay datos locales para una petición, NO se intercepta y sale a la
 * red como siempre. Así el login y cualquier endpoint sin hornear siguen llegando
 * al backend real si algún día acepta este origen, en vez de fallar en silencio o
 * devolver un éxito falso.
 *
 * Excepción: los POST de /quotes y /service-requests se entregan a formularios.js,
 * que los envía por correo. Si ese archivo no está cargado, salen al backend.
 *
 * Se carga como script clásico antes que los módulos de la app, que van diferidos.
 */
(function () {
  'use strict';

  var API_HOST = 'api.agroforestaldecolombia.com';
  var FILES = ['settings', 'categories', 'brands', 'products', 'posts'];
  var DEFAULT_PER_PAGE = 12;

  var store = Object.create(null);
  var ready = Promise.all(FILES.map(function (name) {
    return fetch('data/' + name + '.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (value) { store[name] = value; });
  }));

  // --- utilidades ------------------------------------------------------------

  function norm(v) { return v == null ? '' : String(v).toLowerCase().trim(); }

  // Acepta que el filtro venga por slug, por id o por nombre, y que el producto
  // guarde la categoría como objeto anidado o como campo suelto.
  function refMatches(item, keys, wanted) {
    var w = norm(wanted);
    if (!w) return true;
    for (var i = 0; i < keys.length; i++) {
      var ref = item[keys[i]];
      if (ref == null) continue;
      if (typeof ref === 'object') {
        if (norm(ref.slug) === w || norm(ref.id) === w || norm(ref.name) === w) return true;
      } else if (norm(ref) === w) return true;
    }
    return false;
  }

  function isTruthy(v) { return v === true || v === 1 || v === '1' || v === 'true'; }

  function paginate(items, page, perPage) {
    var total = items.length;
    var last = Math.max(1, Math.ceil(total / perPage));
    var current = Math.min(Math.max(1, page), last);
    var from = (current - 1) * perPage;
    var slice = items.slice(from, from + perPage);
    return {
      data: slice,
      total: total,
      per_page: perPage,
      current_page: current,
      last_page: last,
      from: total ? from + 1 : null,
      to: total ? from + slice.length : null
    };
  }

  // Los datos pueden venir como lista suelta o ya envueltos por el paginador de
  // Laravel, según cómo se hayan exportado. Aceptamos las dos formas.
  function asList(value) {
    if (Array.isArray(value)) return value;
    if (value && Array.isArray(value.data)) return value.data;
    return null;
  }

  // --- resolución de endpoints ----------------------------------------------

  function listProducts(q) {
    var all = asList(store.products);
    if (!all || !all.length) return null;

    var items = all.filter(function (p) {
      if (q.category && !refMatches(p, ['category', 'category_slug', 'category_id'], q.category)) return false;
      if (q.brand && !refMatches(p, ['brand', 'brand_slug', 'brand_id'], q.brand)) return false;
      if (isTruthy(q.featured) && !(isTruthy(p.featured) || isTruthy(p.is_featured))) return false;
      if (!isTruthy(q.include_inactive) && (p.is_active === false || p.status === 'inactive')) return false;
      if (q.search) {
        var hay = norm([p.name, p.sku, p.description, p.short_description].join(' '));
        if (hay.indexOf(norm(q.search)) === -1) return false;
      }
      return true;
    });

    return paginate(items, parseInt(q.page, 10) || 1, parseInt(q.per_page, 10) || DEFAULT_PER_PAGE);
  }

  function findById(list, id) {
    var wanted = norm(id);
    for (var i = 0; i < list.length; i++) {
      if (norm(list[i].id) === wanted || norm(list[i].slug) === wanted) return list[i];
    }
    return null;
  }

  // Los formularios de cliente los envía por correo formularios.js, que devuelve una
  // promesa con la respuesta ya montada. El resto de POST van al backend real.
  var FORMULARIOS = { '/quotes': 'cotizacion', '/service-requests': 'servicio' };

  function resolve(method, path, query, body) {
    if (method === 'POST') {
      var tipo = FORMULARIOS[path];
      if (!tipo || typeof window.__agroEnviarFormulario !== 'function') return null;
      var datos;
      try { datos = typeof body === 'string' ? JSON.parse(body) : body; } catch (e) { return null; }
      return window.__agroEnviarFormulario(tipo, datos);
    }
    if (method !== 'GET') return null;

    if (path === '/settings') return store.settings || null;
    if (path === '/categories') return asList(store.categories) || null;
    if (path === '/brands') return asList(store.brands) || null;
    if (path === '/products') return listProducts(query);

    var m = path.match(/^\/products\/([^/]+)$/);
    if (m) {
      var products = asList(store.products);
      return products && products.length ? findById(products, decodeURIComponent(m[1])) : null;
    }

    if (path === '/posts') {
      var posts = asList(store.posts);
      if (!posts || !posts.length) return null;
      var visible = isTruthy(query.include_drafts)
        ? posts
        : posts.filter(function (p) { return p.status !== 'draft' && p.is_published !== false; });
      return paginate(visible, parseInt(query.page, 10) || 1, parseInt(query.per_page, 10) || DEFAULT_PER_PAGE);
    }

    var mp = path.match(/^\/posts\/([^/]+)$/);
    if (mp) {
      var all = asList(store.posts);
      return all && all.length ? findById(all, decodeURIComponent(mp[1])) : null;
    }

    return null;
  }

  // Devuelve {path, query} si la URL apunta a la API, o null si no es cosa nuestra.
  function parse(url) {
    var u;
    try { u = new URL(url, document.baseURI); } catch (e) { return null; }
    if (u.hostname !== API_HOST) return null;
    if (u.pathname.indexOf('/api') !== 0) return null;
    var query = {};
    u.searchParams.forEach(function (v, k) { query[k] = v; });
    return { path: u.pathname.slice(4) || '/', query: query };
  }

  // --- intercepción de XMLHttpRequest ---------------------------------------
  // La app usa HttpClient sobre XHR (no withFetch), así que este es el camino real.

  var NativeXHR = window.XMLHttpRequest;
  var nativeSend = NativeXHR.prototype.send;
  var nativeOpen = NativeXHR.prototype.open;

  function define(obj, prop, value) {
    try { Object.defineProperty(obj, prop, { value: value, configurable: true }); } catch (e) { /* solo lectura */ }
  }

  function PatchedXHR() {
    var xhr = new NativeXHR();
    var target = null;

    xhr.open = function (method, url) {
      target = { method: String(method || 'GET').toUpperCase(), url: url };
      return nativeOpen.apply(xhr, arguments);
    };

    xhr.send = function (body) {
      var hit = target && parse(target.url);
      if (!hit) return nativeSend.call(xhr, body);

      function responder(status, payload) {
        define(xhr, 'readyState', 4);
        define(xhr, 'status', status);
        define(xhr, 'statusText', status === 200 ? 'OK' : 'Error');
        define(xhr, 'responseURL', new URL(target.url, document.baseURI).href);
        define(xhr, 'response', xhr.responseType === 'json' ? payload : JSON.stringify(payload));
        define(xhr, 'responseText', JSON.stringify(payload));
        define(xhr, 'getAllResponseHeaders', function () { return 'content-type: application/json\r\n'; });
        define(xhr, 'getResponseHeader', function (name) {
          return String(name).toLowerCase() === 'content-type' ? 'application/json' : null;
        });

        xhr.dispatchEvent(new Event('readystatechange'));
        // 'load' también para los errores: Angular decide por el código de estado.
        xhr.dispatchEvent(new ProgressEvent('load'));
        xhr.dispatchEvent(new ProgressEvent('loadend'));
      }

      ready.then(function () {
        var pendiente;
        try { pendiente = resolve(target.method, hit.path, hit.query, body); } catch (e) { pendiente = null; }

        // El envío de formularios es asíncrono; lo demás se resuelve al momento.
        Promise.resolve(pendiente).then(function (payload) {
          // Sin datos horneados para esta petición: que salga a la red.
          if (payload === null || payload === undefined) return nativeSend.call(xhr, body);

          if (payload.__respuesta) return responder(payload.status, payload.body);
          responder(200, payload);
        });
      });
    };

    return xhr;
  }

  PatchedXHR.prototype = NativeXHR.prototype;
  ['UNSENT', 'OPENED', 'HEADERS_RECEIVED', 'LOADING', 'DONE'].forEach(function (k, i) {
    PatchedXHR[k] = i;
  });
  window.XMLHttpRequest = PatchedXHR;

  // --- intercepción de fetch -------------------------------------------------
  // Por si alguna parte de la app (o una versión futura) usa fetch en vez de XHR.

  var nativeFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url);
    var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    var hit = url && parse(url);
    if (!hit) return nativeFetch.apply(window, arguments);

    var args = arguments;
    return ready.then(function () {
      var payload;
      try { payload = resolve(method, hit.path, hit.query); } catch (e) { payload = null; }
      if (payload === null || payload === undefined) return nativeFetch.apply(window, args);
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  };
})();
