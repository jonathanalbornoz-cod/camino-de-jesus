/* ---------------------------------------------------------------
   Comparando precios — de dónde salen los datos.

   Hoy la página lee datos/catalogo.js, que es un catálogo INVENTADO
   para demostración. Este archivo es el enchufe para cambiarlo por
   datos reales sin tocar la interfaz.

   Por qué no se consultan las tiendas directamente desde aquí:
     · Los navegadores bloquean las peticiones a otro dominio (CORS).
     · Las APIs piden claves privadas, que no pueden ir en el HTML.
     · Los términos de uso de casi todas las tiendas prohíben raspar
       sus páginas.
   La forma correcta es un pequeño servidor propio que hable con las
   APIs, guarde el histórico y entregue un JSON con esta misma forma.
--------------------------------------------------------------- */
(function (global) {
  "use strict";

  /* Cada adaptador traduce la respuesta de una tienda a la forma que
     usa la página: { tienda, precio, precioLista, envio, stock,
     entrega, nota, resenas }. Ninguno está conectado todavía. */
  var ADAPTADORES = {
    amazon: {
      api: "Amazon Creators API (sustituye a la PA-API 5.0, retirada el 15-05-2026)",
      docs: "https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction",
      requisitos: "Cuenta de Amazon Associates activa (con ventas recientes) y firma de las peticiones.",
      activo: false
    },
    ebay: {
      api: "eBay Browse API",
      docs: "https://developer.ebay.com/api-docs/buy/browse/overview.html",
      requisitos: "Alta gratuita en el eBay Developers Program; token de aplicación (client credentials).",
      activo: false
    },
    bestbuy: {
      api: "Best Buy Developer API",
      docs: "https://developer.bestbuy.com/",
      requisitos: "Clave gratuita. Entrega precio, disponibilidad y reseñas.",
      activo: false
    },
    walmart: {
      api: "Walmart I/O",
      docs: "https://walmart.io/",
      requisitos: "Aprobación como partner o acceso por la red de afiliados.",
      activo: false
    },
    aliexpress: {
      api: "AliExpress Open Platform (afiliados)",
      docs: "https://openservice.aliexpress.com/",
      requisitos: "Alta como developer y aprobación del programa de afiliados.",
      activo: false
    },
    mercadolibre: {
      api: "API de MercadoLibre",
      docs: "https://developers.mercadolibre.com/",
      requisitos: "Aplicación registrada; OAuth para la mayoría de los recursos.",
      activo: false
    }
  };

  /* Tiendas sin API abierta (Newegg, B&H, Target, Costco y las
     cadenas locales): la vía legal es el feed de productos de su
     programa de afiliados o un acuerdo directo. */

  function estado() {
    var conectados = Object.keys(ADAPTADORES).filter(function (id) {
      return ADAPTADORES[id].activo;
    });
    return { conectados: conectados, demostracion: conectados.length === 0 };
  }

  /* Devuelve el catálogo a mostrar. Mientras no haya adaptadores
     activos, entrega el de demostración tal cual. */
  function cargar() {
    var catalogo = global.CATALOGO;
    if (!catalogo) return Promise.reject(new Error("Falta datos/catalogo.js"));
    return Promise.resolve(catalogo);
  }

  global.Fuentes = { ADAPTADORES: ADAPTADORES, estado: estado, cargar: cargar };
})(window);
