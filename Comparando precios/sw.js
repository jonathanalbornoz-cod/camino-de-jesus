/* ---------------------------------------------------------------
   Comparando precios — caché offline de la app.
   Vive en la raíz del proyecto para alcanzar también a ../comun/.
--------------------------------------------------------------- */
var CACHE = "comparando-precios-v2";

var ARCHIVOS = [
  "./app/",
  "./app/index.html",
  "./app/manifest.json",
  "./app/icono.svg",
  "./comun/estilos.css",
  "./comun/comparador.js",
  "./comun/interfaz.js",
  "./comun/grafica.js",
  "./comun/fuentes.js",
  "./datos/catalogo.js",
  "./web/index.html",
  "./web/ofertas.html",
  "./web/ofertas.css",
  "./web/ofertas.js"
];

self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(CACHE).then(function (cache) {
      /* Si algún archivo falla, la instalación no se cae entera. */
      return Promise.all(ARCHIVOS.map(function (archivo) {
        return cache.add(archivo).catch(function () { return null; });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(claves.map(function (clave) {
        return clave === CACHE ? null : caches.delete(clave);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Primero la red (para ver cambios al instante), con la caché de respaldo. */
self.addEventListener("fetch", function (evento) {
  if (evento.request.method !== "GET") return;

  evento.respondWith(
    fetch(evento.request).then(function (respuesta) {
      if (respuesta && respuesta.ok && respuesta.type === "basic") {
        var copia = respuesta.clone();
        caches.open(CACHE).then(function (cache) {
          cache.put(evento.request, copia);
        });
      }
      return respuesta;
    }).catch(function () {
      return caches.match(evento.request).then(function (guardado) {
        return guardado || caches.match("./app/index.html");
      });
    })
  );
});
