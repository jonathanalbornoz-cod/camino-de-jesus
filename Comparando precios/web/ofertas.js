/* ---------------------------------------------------------------
   Comparando precios — página de ofertas de electrónica.
   Lee el catálogo desde Fuentes.cargar() y arma catálogo, detalle,
   gráfica de historial y reseñas consolidadas.
--------------------------------------------------------------- */
(function () {
  "use strict";

  var catalogo = null;
  var porTienda = {};
  var estado = { buscar: "", categoria: "", tienda: "", orden: "descuento", elegido: null };

  Comparador.definirMoneda("US$");
  var dinero = function (valor) { return Comparador.formatearDinero(valor, 2); };
  var numero = Comparador.formatearNumero;

  /* ---- Utilidades de dibujo ---- */
  function crear(etiqueta, atributos, hijos) {
    var elemento = document.createElement(etiqueta);
    Object.keys(atributos || {}).forEach(function (clave) {
      if (clave === "clase") elemento.className = atributos[clave];
      else if (clave === "texto") elemento.textContent = atributos[clave];
      else if (clave === "html") elemento.innerHTML = atributos[clave];
      else elemento.setAttribute(clave, atributos[clave]);
    });
    (hijos || []).forEach(function (hijo) { if (hijo) elemento.appendChild(hijo); });
    return elemento;
  }

  function vaciar(elemento) {
    while (elemento.firstChild) elemento.removeChild(elemento.firstChild);
  }

  /* Dibujos de los artículos: trazos simples, sin imágenes externas. */
  var ICONOS = {
    audifonos: "M4 13v-1a8 8 0 0 1 16 0v1M4 13h3v6H5a1 1 0 0 1-1-1zM20 13h-3v6h2a1 1 0 0 0 1-1z",
    parlante: "M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM12 8.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zM12 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
    mouse: "M12 2a6 6 0 0 1 6 6v8a6 6 0 0 1-12 0V8a6 6 0 0 1 6-6zM12 6v4",
    monitor: "M3 4h18v12H3zM9 20h6M12 16v4",
    ssd: "M4 6h16v12H4zM8 10h8M8 14h5",
    telefono: "M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM10 5h4",
    tablet: "M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM10.5 19h3",
    consola: "M8 8h8a5 5 0 0 1 5 5v3a3 3 0 0 1-6 0H9a3 3 0 0 1-6 0v-3a5 5 0 0 1 5-5zM7 13h2M8 12v2M16 13h.01M14 15h.01",
    camara: "M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM12 16.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
  };

  function icono(nombre) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "#6b7280");
    svg.setAttribute("stroke-width", "1.4");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    var trazo = document.createElementNS("http://www.w3.org/2000/svg", "path");
    trazo.setAttribute("d", ICONOS[nombre] || ICONOS.monitor);
    svg.appendChild(trazo);
    return svg;
  }

  function estrellas(nota) {
    var contenedor = crear("span", { clase: "estrellas", "aria-label": numero(nota, 1) + " de 5" });
    for (var posicion = 1; posicion <= 5; posicion++) {
      var lleno = nota >= posicion - 0.25;
      contenedor.appendChild(crear("span", {
        clase: lleno ? "" : "estrellas-vacia",
        texto: lleno ? "★" : "☆",
        "aria-hidden": "true"
      }));
    }
    return contenedor;
  }

  /* ---- Cálculos sobre un producto ---- */
  function mejorOferta(producto) {
    return producto.ofertas.reduce(function (mejor, oferta) {
      return oferta.total < mejor.total ? oferta : mejor;
    });
  }

  function descuento(producto) {
    var mejor = mejorOferta(producto);
    return (producto.precioLista - mejor.precio) / producto.precioLista * 100;
  }

  function fechasDelHistorial(historial) {
    var inicio = new Date(historial.desde + "T00:00:00");
    var fechas = [];
    for (var dia = 0; dia < historial.dias; dia++) {
      var fecha = new Date(inicio.getTime() + dia * 86400000);
      fechas.push(fecha.toISOString().slice(0, 10));
    }
    return fechas;
  }

  /* El color de cada tienda en la gráfica sigue el orden del catálogo
     de tiendas, no el ranking de precio: así una tienda no cambia de
     color al cambiar de producto. */
  function tiendasDelHistorial(producto) {
    return catalogo.tiendas
      .map(function (tienda) { return tienda.id; })
      .filter(function (id) { return producto.historial.series[id]; })
      .slice(0, Grafica.SERIES.length);
  }

  function colorDeTienda(producto, tiendaId) {
    var posicion = tiendasDelHistorial(producto).indexOf(tiendaId);
    return posicion >= 0 ? Grafica.SERIES[posicion] : "#6b7280";
  }

  function enlaceBusqueda(tienda, producto) {
    var consulta = producto.nombre + " " + producto.modelo;
    if (tienda.buscar.indexOf("listado.mercadolibre") >= 0) {
      return tienda.buscar.replace("{q}", encodeURIComponent(consulta.replace(/\s+/g, "-")));
    }
    return tienda.buscar.replace("{q}", encodeURIComponent(consulta));
  }

  /* ---- Cifras de cabecera ---- */
  function pintarCifras() {
    var productos = catalogo.productos;
    var enOferta = productos.reduce(function (suma, p) {
      return suma + p.ofertas.filter(function (o) { return o.precio < p.precioLista; }).length;
    }, 0);
    var mejor = productos.reduce(function (a, p) { return descuento(p) > descuento(a) ? p : a; });
    var ofertasTotales = productos.reduce(function (suma, p) { return suma + p.ofertas.length; }, 0);

    document.getElementById("cifra-articulos").textContent = numero(productos.length, 0);
    document.getElementById("cifra-articulos-nota").textContent =
      ofertasTotales + " precios recogidos";
    document.getElementById("cifra-ofertas").textContent = numero(enOferta, 0);
    document.getElementById("cifra-tiendas").textContent = numero(catalogo.tiendas.length, 0);
    document.getElementById("cifra-tiendas-nota").textContent =
      catalogo.tiendas.slice(0, 3).map(function (t) { return t.nombre; }).join(", ") + " y más";
    document.getElementById("cifra-descuento").textContent = numero(descuento(mejor), 0) + " %";
    document.getElementById("cifra-descuento-nota").textContent = mejor.nombre;
    document.getElementById("pie-generado").textContent =
      "Catálogo de demostración generado el " + catalogo.generado +
      " · precios en " + catalogo.moneda + ".";
  }

  /* ---- Filtros ---- */
  function pintarFiltros() {
    var categoria = document.getElementById("f-categoria");
    categoria.appendChild(crear("option", { value: "", texto: "Todas" }));
    catalogo.categorias.forEach(function (item) {
      categoria.appendChild(crear("option", { value: item.id, texto: item.nombre }));
    });

    var tienda = document.getElementById("f-tienda");
    tienda.appendChild(crear("option", { value: "", texto: "Todas" }));
    catalogo.tiendas.forEach(function (item) {
      tienda.appendChild(crear("option", { value: item.id, texto: item.nombre }));
    });

    document.getElementById("filtros").addEventListener("input", function (evento) {
      var campo = evento.target.id;
      if (campo === "f-buscar") estado.buscar = evento.target.value.trim().toLowerCase();
      if (campo === "f-categoria") estado.categoria = evento.target.value;
      if (campo === "f-tienda") estado.tienda = evento.target.value;
      if (campo === "f-orden") estado.orden = evento.target.value;
      pintarCatalogo();
    });
    document.getElementById("filtros").addEventListener("submit", function (evento) {
      evento.preventDefault();
    });
  }

  function filtrar() {
    return catalogo.productos.filter(function (producto) {
      if (estado.categoria && producto.categoria !== estado.categoria) return false;
      if (estado.tienda && !producto.ofertas.some(function (o) { return o.tienda === estado.tienda; })) return false;
      if (estado.buscar) {
        var texto = (producto.nombre + " " + producto.marca + " " + producto.modelo).toLowerCase();
        if (texto.indexOf(estado.buscar) < 0) return false;
      }
      return true;
    }).sort(function (a, b) {
      if (estado.orden === "precio") return mejorOferta(a).total - mejorOferta(b).total;
      if (estado.orden === "nota") return b.resenas.nota - a.resenas.nota;
      if (estado.orden === "nombre") return a.nombre.localeCompare(b.nombre, "es");
      return descuento(b) - descuento(a);
    });
  }

  /* ---- Tarjetas del catálogo ---- */
  function tarjeta(producto) {
    var mejor = mejorOferta(producto);
    var rebaja = descuento(producto);
    var tienda = porTienda[mejor.tienda];

    var tapa = crear("div", { clase: "producto-tapa" }, [icono(producto.icono)]);
    if (rebaja >= 1) {
      tapa.appendChild(crear("span", { clase: "insignia", texto: "−" + numero(rebaja, 0) + " %" }));
    }

    var serie = producto.historial.series[tiendasDelHistorial(producto)[0]];
    var muestra = serie.filter(function (valor, indice) {
      return indice % Math.ceil(serie.length / 12) === 0;
    });

    var boton = crear("button", {
      clase: "producto" + (estado.elegido === producto.id ? " elegido" : ""),
      type: "button",
      "aria-label": "Ver la comparación de " + producto.nombre
    }, [
      tapa,
      crear("div", {}, [
        crear("div", { clase: "producto-marca", texto: producto.marca }),
        crear("div", { clase: "producto-nombre", texto: producto.nombre })
      ]),
      crear("div", { clase: "producto-precios" }, [
        crear("span", { clase: "precio-actual", texto: dinero(mejor.precio) }),
        rebaja >= 1 ? crear("span", { clase: "precio-lista", texto: dinero(producto.precioLista) }) : null
      ]),
      crear("div", { clase: "cifra-nota", texto: "en " + tienda.nombre + " · " + producto.ofertas.length + " tiendas" }),
      crear("div", { clase: "producto-pie" }, [
        estrellas(producto.resenas.nota),
        crear("span", { texto: numero(producto.resenas.nota, 1) + " (" + numero(producto.resenas.total, 0) + ")" }),
        Grafica.chispa(muestra, 56, 20)
      ])
    ]);

    boton.addEventListener("click", function () { elegir(producto.id); });
    return boton;
  }

  function pintarCatalogo() {
    var lista = filtrar();
    var rejilla = document.getElementById("rejilla");
    vaciar(rejilla);
    document.getElementById("conteo").textContent = lista.length === 1
      ? "1 artículo"
      : numero(lista.length, 0) + " artículos" +
        (lista.length !== catalogo.productos.length ? " de " + catalogo.productos.length : "");

    if (!lista.length) {
      rejilla.appendChild(crear("p", { clase: "vacio", texto: "Ningún artículo coincide con el filtro." }));
      return;
    }
    lista.forEach(function (producto) { rejilla.appendChild(tarjeta(producto)); });
  }

  /* ---- Comparación lado a lado ---- */
  function columnasDeTiendas(producto) {
    var maximo = Math.max.apply(null, producto.ofertas.map(function (o) { return o.total; }));
    var mejor = mejorOferta(producto);
    var pista = crear("div", { clase: "columnas" });

    producto.ofertas.forEach(function (oferta) {
      var tienda = porTienda[oferta.tienda];
      var esMejor = oferta === mejor;
      var diferencia = oferta.total - mejor.total;

      var medida = crear("span", {});
      medida.style.width = ((oferta.total / maximo) * 100) + "%";

      var estadoStock = oferta.stock === "disponible"
        ? { clase: "estado-bueno", icono: "●", texto: "En stock" }
        : (oferta.stock === "pocas"
          ? { clase: "estado-medio", icono: "▲", texto: "Pocas unidades" }
          : { clase: "estado-malo", icono: "■", texto: "Agotado" });

      pista.appendChild(crear("div", { clase: "columna" + (esMejor ? " mejor" : "") }, [
        crear("div", { clase: "columna-tienda" }, [
          (function () {
            var sello = crear("span", { clase: "sello", texto: tienda.nombre.slice(0, 1) });
            sello.style.background = colorDeTienda(producto, oferta.tienda);
            return sello;
          })(),
          crear("span", { texto: tienda.nombre })
        ]),
        crear("div", { clase: "columna-precio", texto: dinero(oferta.precio) }),
        crear("div", { clase: "columna-envio", texto: oferta.envio ? "+ " + dinero(oferta.envio) + " de envío" : "Envío gratis" }),
        crear("div", { clase: "columna-medida" }, [medida]),
        crear("div", { clase: "columna-dato" }, [
          crear("span", { texto: "Total" }),
          crear("strong", { texto: dinero(oferta.total) })
        ]),
        crear("div", { clase: "columna-dato" }, [
          crear("span", { texto: esMejor ? "Mejor precio" : "Diferencia" }),
          crear("span", { texto: esMejor ? "✓" : "+" + dinero(diferencia) })
        ]),
        crear("div", { clase: "columna-dato" }, [
          crear("span", { texto: "Entrega" }),
          crear("span", { texto: oferta.entrega })
        ]),
        crear("div", { clase: "columna-dato" }, [
          crear("span", { texto: "Valoración" }),
          crear("span", { texto: numero(oferta.nota, 1) + " ★ (" + numero(oferta.resenas, 0) + ")" })
        ]),
        crear("div", { clase: "columna-dato" }, [
          crear("span", { clase: "estado-etiqueta " + estadoStock.clase, texto: estadoStock.icono + " " + estadoStock.texto })
        ]),
        crear("a", {
          clase: "ir",
          href: enlaceBusqueda(tienda, producto),
          target: "_blank",
          rel: "noopener noreferrer",
          texto: "Buscar en " + tienda.nombre
        })
      ]));
    });
    return pista;
  }

  /* ---- Historial ---- */
  function bloqueHistorial(producto) {
    var fechas = fechasDelHistorial(producto.historial);
    var ids = tiendasDelHistorial(producto);
    var series = ids.map(function (id) {
      return { nombre: porTienda[id].nombre, valores: producto.historial.series[id] };
    });

    var todos = [];
    series.forEach(function (serie) { todos = todos.concat(serie.valores); });
    var minimo = Math.min.apply(null, todos);
    var maximo = Math.max.apply(null, todos);
    var promedio = todos.reduce(function (suma, valor) { return suma + valor; }, 0) / todos.length;
    var actual = mejorOferta(producto).precio;

    var veredicto;
    if (actual <= minimo * 1.02) {
      veredicto = { clase: "estado-bueno", icono: "✓", texto: "Buen momento: está en su punto más bajo de los últimos 90 días." };
    } else if (actual <= promedio) {
      veredicto = { clase: "estado-medio", icono: "≈", texto: "Precio normal: por debajo del promedio, pero ya estuvo más barato." };
    } else {
      veredicto = { clase: "estado-malo", icono: "!", texto: "Está caro: por encima de su promedio de 90 días." };
    }

    var lienzo = crear("div", {});
    var bloque = crear("div", { clase: "bloque" }, [
      crear("h3", { texto: "Historial de precios" }),
      crear("p", { clase: "sub", texto: "Últimos 90 días en las " + series.length + " tiendas con seguimiento. Pasa el puntero o usa las flechas del teclado." }),
      crear("div", { clase: "tarjeta" }, [
        lienzo,
        crear("div", { clase: "resumen-precios" }, [
          crear("div", {}, [crear("strong", { texto: dinero(minimo) }), document.createTextNode("mínimo")]),
          crear("div", {}, [crear("strong", { texto: dinero(promedio) }), document.createTextNode("promedio")]),
          crear("div", {}, [crear("strong", { texto: dinero(maximo) }), document.createTextNode("máximo")]),
          crear("div", {}, [crear("strong", { texto: dinero(actual) }), document.createTextNode("mejor precio hoy")])
        ]),
        crear("p", { clase: "estado-etiqueta " + veredicto.clase, texto: veredicto.icono + " " + veredicto.texto })
      ])
    ]);

    /* La gráfica se dibuja cuando el bloque ya está en el documento,
       para poder medir el ancho disponible. */
    bloque.dibujar = function () {
      Grafica.lineas({
        contenedor: lienzo,
        series: series,
        fechas: fechas,
        formato: function (valor) { return dinero(valor); },
        descripcion: "Historial de precios de " + producto.nombre + " en " +
                     series.map(function (s) { return s.nombre; }).join(", ")
      });
    };
    return bloque;
  }

  /* ---- Reseñas consolidadas ---- */
  function bloqueResenas(producto) {
    var resenas = producto.resenas;
    var distribucion = crear("div", {});
    var maximoTienda = Math.max.apply(null, resenas.porTienda.map(function (t) { return t.total; }));

    var filas = resenas.distribucion.map(function (cantidad, indice) {
      return {
        etiqueta: (5 - indice) + " ★",
        valor: cantidad,
        porcentaje: cantidad / resenas.total * 100
      };
    });

    var temas = crear("div", { clase: "temas" });
    resenas.pros.forEach(function (item) {
      temas.appendChild(crear("span", { clase: "tema tema-pro" }, [
        document.createTextNode("👍 " + item.tema + " "),
        crear("b", { texto: numero(item.menciones, 0) })
      ]));
    });
    resenas.contras.forEach(function (item) {
      temas.appendChild(crear("span", { clase: "tema tema-contra" }, [
        document.createTextNode("👎 " + item.tema + " "),
        crear("b", { texto: numero(item.menciones, 0) })
      ]));
    });

    var listaTiendas = crear("div", { clase: "por-tienda" });
    resenas.porTienda.forEach(function (fila) {
      var relleno = crear("span", { clase: "barra-relleno" });
      relleno.style.width = ((fila.total / maximoTienda) * 100) + "%";
      relleno.style.background = colorDeTienda(producto, fila.tienda);
      listaTiendas.appendChild(crear("div", { clase: "por-tienda-fila" }, [
        crear("span", { clase: "nombre", texto: porTienda[fila.tienda].nombre }),
        estrellas(fila.nota),
        crear("span", { texto: numero(fila.nota, 1) }),
        crear("span", { clase: "barra-pista" }, [relleno]),
        crear("span", { clase: "barra-valor", texto: numero(fila.total, 0) })
      ]));
    });

    var bloque = crear("div", { clase: "bloque" }, [
      crear("h3", { texto: "Reseñas consolidadas" }),
      crear("p", { clase: "sub", texto: "Nota ponderada por la cantidad de reseñas de cada tienda, no un promedio simple." }),
      crear("div", { clase: "tarjeta resenas" }, [
        crear("div", { clase: "nota-global" }, [
          crear("div", { clase: "cifra-valor", texto: numero(resenas.nota, 1) }),
          estrellas(resenas.nota),
          crear("div", { clase: "cifra-nota", texto: numero(resenas.total, 0) + " reseñas en " + resenas.porTienda.length + " tiendas" })
        ]),
        crear("div", {}, [
          distribucion,
          crear("div", { clase: "sub", style: "margin:14px 0 4px", texto: "Nota y cantidad de reseñas por tienda" }),
          listaTiendas,
          crear("div", { clase: "sub", style: "margin:14px 0 0", texto: "Lo que más se repite" }),
          temas
        ])
      ])
    ]);

    bloque.dibujar = function () {
      Grafica.barras({
        contenedor: distribucion,
        filas: filas,
        formato: function (valor) {
          return numero(valor, 0) + " (" + numero(valor / resenas.total * 100, 0) + " %)";
        }
      });
    };
    return bloque;
  }

  /* ---- Detalle completo ---- */
  function pintarDetalle(producto) {
    var seccion = document.getElementById("detalle");
    vaciar(seccion);
    seccion.hidden = false;

    var mejor = mejorOferta(producto);
    var rebaja = descuento(producto);
    var tapa = crear("div", { clase: "producto-tapa" }, [icono(producto.icono)]);

    var cerrar = crear("button", { clase: "boton-secundario cerrar-detalle", type: "button", texto: "Cerrar" });
    cerrar.addEventListener("click", function () {
      seccion.hidden = true;
      estado.elegido = null;
      history.replaceState(null, "", location.pathname);
      pintarCatalogo();
    });

    var especificaciones = crear("div", { clase: "especificaciones" });
    producto.especificaciones.forEach(function (fila) {
      especificaciones.appendChild(crear("div", { clase: "especificacion" }, [
        crear("span", { texto: fila.clave }),
        crear("span", { texto: fila.valor })
      ]));
    });

    seccion.appendChild(crear("div", { clase: "detalle-cabecera" }, [
      tapa,
      crear("div", { clase: "detalle-titulo" }, [
        crear("div", { clase: "producto-marca", texto: producto.marca + " · " + producto.modelo }),
        crear("h2", { texto: producto.nombre }),
        crear("div", { clase: "hero-precio", texto: dinero(mejor.precio) }),
        crear("div", { clase: "hero-desde", texto:
          "mejor precio de " + producto.ofertas.length + " tiendas · " +
          (rebaja >= 1 ? numero(rebaja, 0) + " % bajo el precio de lista (" + dinero(producto.precioLista) + ")" : "sin descuento") }),
        especificaciones
      ]),
      cerrar
    ]));

    seccion.appendChild(crear("div", { clase: "bloque" }, [
      crear("h3", { texto: "Comparación tienda por tienda" }),
      crear("p", { clase: "sub", texto: "Ordenadas por precio final con envío. La barra muestra cuánto más cuesta cada una frente a la más cara." }),
      columnasDeTiendas(producto),
      producto.ofertas.length > 4
        ? crear("p", { clase: "pista-desliza", texto: "→ Desliza para ver las " + producto.ofertas.length + " tiendas." })
        : null
    ]));

    var historial = bloqueHistorial(producto);
    seccion.appendChild(historial);
    var resenas = bloqueResenas(producto);
    seccion.appendChild(resenas);

    historial.dibujar();
    resenas.dibujar();
  }

  function elegir(id) {
    var producto = catalogo.productos.filter(function (p) { return p.id === id; })[0];
    if (!producto) return;
    estado.elegido = id;
    history.replaceState(null, "", "#" + id);
    pintarCatalogo();
    pintarDetalle(producto);
    document.getElementById("detalle").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---- Tabla de fuentes ---- */
  function pintarFuentes() {
    var cuerpo = document.querySelector("#tabla-fuentes tbody");
    var nombres = { oficial: "API oficial", afiliados: "API de afiliados", ninguna: "Sin API" };
    catalogo.tiendas.forEach(function (tienda) {
      var pastilla = crear("span", {
        clase: "pastilla pastilla-" + tienda.api.estado,
        texto: nombres[tienda.api.estado]
      });
      cuerpo.appendChild(crear("tr", {}, [
        crear("td", {}, [crear("a", { href: "https://" + tienda.sitio, target: "_blank", rel: "noopener noreferrer", texto: tienda.nombre })]),
        crear("td", { texto: tienda.pais }),
        crear("td", {}, [pastilla]),
        crear("td", {}, [
          crear("a", { href: tienda.api.url, target: "_blank", rel: "noopener noreferrer", texto: tienda.api.nombre }),
          crear("div", { clase: "cifra-nota", texto: tienda.api.nota })
        ])
      ]));
    });
  }

  /* ---- Arranque ---- */
  Fuentes.cargar().then(function (datos) {
    catalogo = datos;
    catalogo.tiendas.forEach(function (tienda) { porTienda[tienda.id] = tienda; });
    pintarCifras();
    pintarFiltros();
    pintarFuentes();
    pintarCatalogo();
    var inicial = location.hash.replace("#", "");
    if (inicial) elegir(inicial);
  }).catch(function (error) {
    document.getElementById("rejilla").appendChild(
      crear("p", { clase: "vacio", texto: "No se pudo cargar el catálogo: " + error.message })
    );
  });
})();
