/* ---------------------------------------------------------------
   Comparando precios — gráficas en SVG, sin librerías externas.

   Grafica.lineas()  historial de precios por tienda
   Grafica.barras()  distribución de estrellas

   Paleta categórica validada para daltonismo (ΔE mínimo 9,1 en el
   par adyacente más difícil). El orden de los colores es fijo: la
   tienda 1 siempre es azul, la 2 naranja, etc.
--------------------------------------------------------------- */
(function (global) {
  "use strict";

  var SVG = "http://www.w3.org/2000/svg";

  var SERIES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100"];
  var TINTA = "#0b0b0b";
  var TINTA_SUAVE = "#52514e";
  var APAGADO = "#898781";
  var REJILLA = "#e1e0d9";
  var EJE = "#c3c2b7";
  var SUPERFICIE = "#ffffff";

  function nodo(etiqueta, atributos) {
    var elemento = document.createElementNS(SVG, etiqueta);
    Object.keys(atributos || {}).forEach(function (clave) {
      elemento.setAttribute(clave, atributos[clave]);
    });
    return elemento;
  }

  function limpiar(contenedor) {
    while (contenedor.firstChild) contenedor.removeChild(contenedor.firstChild);
  }

  /* Marcas de eje redondeadas a números limpios. */
  function marcasY(minimo, maximo, cantidad) {
    var bruto = (maximo - minimo) / (cantidad - 1);
    var magnitud = Math.pow(10, Math.floor(Math.log(bruto) / Math.LN10));
    var paso = magnitud;
    [1, 2, 2.5, 5, 10].some(function (multiplo) {
      if (magnitud * multiplo >= bruto) { paso = magnitud * multiplo; return true; }
      return false;
    });
    var inicio = Math.floor(minimo / paso) * paso;
    var marcas = [];
    for (var valor = inicio; valor <= maximo + paso * 0.001; valor += paso) {
      if (valor >= minimo - paso * 0.001) marcas.push(Math.round(valor * 100) / 100);
    }
    return marcas;
  }

  function fechaCorta(texto) {
    var partes = texto.split("-");
    var meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    return Number(partes[2]) + " " + meses[Number(partes[1]) - 1];
  }

  /* -------------------------------------------------------------
     Gráfica de líneas con cruceta, leyenda y vista de tabla.
     opciones: { contenedor, series:[{nombre, valores}], fechas,
                 formato(valor), alto }
  ------------------------------------------------------------- */
  function lineas(opciones) {
    var contenedor = opciones.contenedor;
    var series = opciones.series.slice(0, SERIES.length);
    var fechas = opciones.fechas;
    var formato = opciones.formato || function (v) { return String(v); };
    var alto = opciones.alto || 260;

    var marco = document.createElement("div");
    marco.className = "grafica";
    var zonaSvg = document.createElement("div");
    zonaSvg.className = "grafica-lienzo";
    var leyenda = document.createElement("div");
    leyenda.className = "leyenda";
    var globo = document.createElement("div");
    globo.className = "globo";
    globo.hidden = true;

    var interruptor = document.createElement("button");
    interruptor.type = "button";
    interruptor.className = "boton-secundario grafica-tabla-boton";
    interruptor.textContent = "Ver como tabla";
    var tabla = document.createElement("div");
    tabla.className = "grafica-tabla";
    tabla.hidden = true;

    zonaSvg.appendChild(globo);
    marco.appendChild(leyenda);
    marco.appendChild(zonaSvg);
    marco.appendChild(interruptor);
    marco.appendChild(tabla);
    limpiar(contenedor);
    contenedor.appendChild(marco);

    /* ---- Leyenda: siempre presente con dos o más series ---- */
    if (series.length > 1) {
      series.forEach(function (serie, indice) {
        var entrada = document.createElement("span");
        entrada.className = "leyenda-item";
        var trazo = document.createElement("span");
        trazo.className = "leyenda-linea";
        trazo.style.background = SERIES[indice];
        var texto = document.createElement("span");
        texto.textContent = serie.nombre;
        entrada.appendChild(trazo);
        entrada.appendChild(texto);
        leyenda.appendChild(entrada);
      });
    }

    var estado = { indice: -1 };
    var geometria = null;

    function dibujar() {
      var ancho = Math.max(280, zonaSvg.clientWidth || contenedor.clientWidth || 320);
      var margen = { arriba: 14, derecha: 16, abajo: 26, izquierda: 54 };
      var util = { ancho: ancho - margen.izquierda - margen.derecha,
                   alto: alto - margen.arriba - margen.abajo };

      var todos = [];
      series.forEach(function (s) { todos = todos.concat(s.valores); });
      var minimo = Math.min.apply(null, todos);
      var maximo = Math.max.apply(null, todos);
      var respiro = (maximo - minimo) * 0.18 || maximo * 0.05 || 1;
      var techo = maximo + respiro;
      var piso = Math.max(0, minimo - respiro);

      var x = function (indice) {
        return margen.izquierda + (util.ancho * indice) / Math.max(1, fechas.length - 1);
      };
      var y = function (valor) {
        return margen.arriba + util.alto - ((valor - piso) / (techo - piso)) * util.alto;
      };
      geometria = { x: x, ancho: ancho, margen: margen, util: util };

      var svg = nodo("svg", {
        viewBox: "0 0 " + ancho + " " + alto,
        width: "100%", height: String(alto),
        role: "img", tabindex: "0",
        "aria-label": opciones.descripcion || "Historial de precios"
      });

      /* Rejilla y eje Y */
      marcasY(piso, techo, 5).forEach(function (valor) {
        svg.appendChild(nodo("line", {
          x1: margen.izquierda, x2: ancho - margen.derecha,
          y1: y(valor), y2: y(valor), stroke: REJILLA, "stroke-width": 1
        }));
        var etiqueta = nodo("text", {
          x: margen.izquierda - 8, y: y(valor) + 4,
          "text-anchor": "end", fill: APAGADO, "font-size": "11"
        });
        etiqueta.textContent = formato(valor);
        svg.appendChild(etiqueta);
      });

      /* Eje X: primera, media y última fecha */
      [0, Math.floor(fechas.length / 2), fechas.length - 1].forEach(function (indice, orden) {
        var etiqueta = nodo("text", {
          x: x(indice), y: alto - 8,
          "text-anchor": orden === 0 ? "start" : (orden === 2 ? "end" : "middle"),
          fill: APAGADO, "font-size": "11"
        });
        etiqueta.textContent = fechaCorta(fechas[indice]);
        svg.appendChild(etiqueta);
      });

      svg.appendChild(nodo("line", {
        x1: margen.izquierda, x2: ancho - margen.derecha,
        y1: margen.arriba + util.alto, y2: margen.arriba + util.alto,
        stroke: EJE, "stroke-width": 1
      }));

      /* Cruceta (debajo de las líneas) */
      var cruceta = nodo("line", {
        y1: margen.arriba, y2: margen.arriba + util.alto,
        stroke: EJE, "stroke-width": 1, visibility: "hidden"
      });
      svg.appendChild(cruceta);

      /* Líneas */
      var puntos = [];
      series.forEach(function (serie, indice) {
        var camino = serie.valores.map(function (valor, posicion) {
          return (posicion ? "L" : "M") + x(posicion).toFixed(1) + " " + y(valor).toFixed(1);
        }).join(" ");
        svg.appendChild(nodo("path", {
          d: camino, fill: "none", stroke: SERIES[indice],
          "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round"
        }));

        var ultimo = serie.valores.length - 1;
        svg.appendChild(nodo("circle", {
          cx: x(ultimo), cy: y(serie.valores[ultimo]), r: 4,
          fill: SERIES[indice], stroke: SUPERFICIE, "stroke-width": 2
        }));

        var marcador = nodo("circle", {
          r: 4, fill: SERIES[indice], stroke: SUPERFICIE,
          "stroke-width": 2, visibility: "hidden"
        });
        svg.appendChild(marcador);
        puntos.push(marcador);
      });

      /* Etiqueta directa solo sobre la serie más barata hoy */
      var masBarata = 0;
      series.forEach(function (serie, indice) {
        if (serie.valores[serie.valores.length - 1] <
            series[masBarata].valores[series[masBarata].valores.length - 1]) masBarata = indice;
      });
      var valorFinal = series[masBarata].valores[series[masBarata].valores.length - 1];
      var etiquetaFinal = nodo("text", {
        x: ancho - margen.derecha, y: Math.max(margen.arriba + 10, y(valorFinal) - 10),
        "text-anchor": "end", fill: TINTA, "font-size": "12", "font-weight": "700"
      });
      etiquetaFinal.textContent = formato(valorFinal);
      svg.appendChild(etiquetaFinal);

      /* Capa de captura del puntero */
      var captura = nodo("rect", {
        x: margen.izquierda, y: margen.arriba,
        width: util.ancho, height: util.alto, fill: "transparent"
      });
      svg.appendChild(captura);

      function mostrar(indice) {
        estado.indice = indice;
        if (indice < 0) {
          cruceta.setAttribute("visibility", "hidden");
          puntos.forEach(function (p) { p.setAttribute("visibility", "hidden"); });
          globo.hidden = true;
          return;
        }
        cruceta.setAttribute("x1", x(indice));
        cruceta.setAttribute("x2", x(indice));
        cruceta.setAttribute("visibility", "visible");

        limpiar(globo);
        var titulo = document.createElement("div");
        titulo.className = "globo-fecha";
        titulo.textContent = fechaCorta(fechas[indice]);
        globo.appendChild(titulo);

        series.forEach(function (serie, orden) {
          puntos[orden].setAttribute("cx", x(indice));
          puntos[orden].setAttribute("cy", y(serie.valores[indice]));
          puntos[orden].setAttribute("visibility", "visible");

          var fila = document.createElement("div");
          fila.className = "globo-fila";
          var trazo = document.createElement("span");
          trazo.className = "leyenda-linea";
          trazo.style.background = SERIES[orden];
          var valor = document.createElement("strong");
          valor.textContent = formato(serie.valores[indice]);
          var nombre = document.createElement("span");
          nombre.className = "globo-nombre";
          nombre.textContent = serie.nombre;
          fila.appendChild(trazo);
          fila.appendChild(valor);
          fila.appendChild(nombre);
          globo.appendChild(fila);
        });

        globo.hidden = false;
        var posicion = x(indice);
        var mitad = globo.offsetWidth / 2;
        globo.style.left = Math.min(Math.max(posicion, mitad + 4), ancho - mitad - 4) + "px";
      }

      function desdeEvento(evento) {
        var caja = svg.getBoundingClientRect();
        var relativo = (evento.clientX - caja.left) * (ancho / caja.width);
        var indice = Math.round(((relativo - margen.izquierda) / util.ancho) * (fechas.length - 1));
        return Math.min(fechas.length - 1, Math.max(0, indice));
      }

      svg.addEventListener("pointermove", function (evento) { mostrar(desdeEvento(evento)); });
      svg.addEventListener("pointerleave", function () { mostrar(-1); });
      svg.addEventListener("focus", function () { mostrar(fechas.length - 1); });
      svg.addEventListener("blur", function () { mostrar(-1); });
      svg.addEventListener("keydown", function (evento) {
        if (evento.key !== "ArrowLeft" && evento.key !== "ArrowRight") return;
        evento.preventDefault();
        var siguiente = (estado.indice < 0 ? fechas.length - 1 : estado.indice) +
                        (evento.key === "ArrowRight" ? 1 : -1);
        mostrar(Math.min(fechas.length - 1, Math.max(0, siguiente)));
      });

      limpiar(zonaSvg);
      zonaSvg.appendChild(globo);
      zonaSvg.appendChild(svg);
    }

    /* ---- Vista de tabla: todo valor de la gráfica es alcanzable sin puntero ---- */
    function construirTabla() {
      limpiar(tabla);
      var elemento = document.createElement("table");
      var cabecera = document.createElement("tr");
      ["Fecha"].concat(series.map(function (s) { return s.nombre; })).forEach(function (texto) {
        var celda = document.createElement("th");
        celda.textContent = texto;
        cabecera.appendChild(celda);
      });
      elemento.appendChild(cabecera);
      /* Una fila por semana para que se pueda leer. */
      fechas.forEach(function (fecha, indice) {
        if (indice % 7 !== 0 && indice !== fechas.length - 1) return;
        var fila = document.createElement("tr");
        var dia = document.createElement("th");
        dia.textContent = fechaCorta(fecha);
        fila.appendChild(dia);
        series.forEach(function (serie) {
          var celda = document.createElement("td");
          celda.textContent = formato(serie.valores[indice]);
          fila.appendChild(celda);
        });
        elemento.appendChild(fila);
      });
      tabla.appendChild(elemento);
    }

    interruptor.addEventListener("click", function () {
      tabla.hidden = !tabla.hidden;
      interruptor.textContent = tabla.hidden ? "Ver como tabla" : "Ocultar la tabla";
      if (!tabla.hidden) construirTabla();
    });

    dibujar();
    if (global.ResizeObserver) {
      var observador = new ResizeObserver(function () { dibujar(); });
      observador.observe(zonaSvg);
    } else {
      global.addEventListener("resize", dibujar);
    }
    return { redibujar: dibujar };
  }

  /* -------------------------------------------------------------
     Barras horizontales de una sola serie (distribución de estrellas).
     opciones: { contenedor, filas:[{etiqueta, valor}], formato }
  ------------------------------------------------------------- */
  function barras(opciones) {
    var contenedor = opciones.contenedor;
    var filas = opciones.filas;
    var formato = opciones.formato || function (v) { return String(v); };
    var maximo = Math.max.apply(null, filas.map(function (f) { return f.valor; })) || 1;

    limpiar(contenedor);
    var lista = document.createElement("div");
    lista.className = "barras";

    filas.forEach(function (fila) {
      var linea = document.createElement("div");
      linea.className = "barra-fila";

      var etiqueta = document.createElement("span");
      etiqueta.className = "barra-etiqueta";
      etiqueta.textContent = fila.etiqueta;

      var pista = document.createElement("span");
      pista.className = "barra-pista";
      var relleno = document.createElement("span");
      relleno.className = "barra-relleno";
      relleno.style.width = ((fila.valor / maximo) * 100) + "%";
      pista.appendChild(relleno);

      var valor = document.createElement("span");
      valor.className = "barra-valor";
      valor.textContent = formato(fila.valor);

      linea.appendChild(etiqueta);
      linea.appendChild(pista);
      linea.appendChild(valor);
      lista.appendChild(linea);
    });

    contenedor.appendChild(lista);
  }

  /* Mini gráfica de 12 puntos para las tarjetas. */
  function chispa(valores, ancho, alto) {
    var minimo = Math.min.apply(null, valores);
    var maximo = Math.max.apply(null, valores);
    var rango = maximo - minimo || 1;
    var svg = nodo("svg", {
      viewBox: "0 0 " + ancho + " " + alto, width: ancho, height: alto,
      class: "chispa", "aria-hidden": "true", focusable: "false"
    });
    var camino = valores.map(function (valor, indice) {
      var x = (ancho - 2) * (indice / (valores.length - 1)) + 1;
      var y = alto - 2 - ((valor - minimo) / rango) * (alto - 4);
      return (indice ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }).join(" ");
    svg.appendChild(nodo("path", {
      d: camino, fill: "none", stroke: APAGADO,
      "stroke-width": 1.5, "stroke-linecap": "round", "stroke-linejoin": "round"
    }));
    var ultimo = valores.length - 1;
    svg.appendChild(nodo("circle", {
      cx: ancho - 1,
      cy: alto - 2 - ((valores[ultimo] - minimo) / rango) * (alto - 4),
      r: 2.5, fill: TINTA_SUAVE
    }));
    return svg;
  }

  global.Grafica = { lineas: lineas, barras: barras, chispa: chispa, SERIES: SERIES };
})(window);
