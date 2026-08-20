/* ---------------------------------------------------------------
   Comparando precios — lógica compartida entre la web y la app.
   No depende de ningún framework ni de internet.
--------------------------------------------------------------- */
(function (global) {
  "use strict";

  /* Unidades admitidas y su equivalencia con la unidad base de su familia. */
  var UNIDADES = {
    g:      { familia: "peso",     base: "kg",     factor: 0.001, etiqueta: "g"      },
    kg:     { familia: "peso",     base: "kg",     factor: 1,     etiqueta: "kg"     },
    ml:     { familia: "volumen",  base: "L",      factor: 0.001, etiqueta: "ml"     },
    l:      { familia: "volumen",  base: "L",      factor: 1,     etiqueta: "L"      },
    unidad: { familia: "cantidad", base: "unidad", factor: 1,     etiqueta: "unidad" },
    m:      { familia: "largo",    base: "m",      factor: 1,     etiqueta: "m"      },
    cm:     { familia: "largo",    base: "m",      factor: 0.01,  etiqueta: "cm"     }
  };

  var moneda = "$";

  function definirMoneda(simbolo) {
    moneda = simbolo || "$";
  }

  function formatearNumero(valor, decimales) {
    if (!isFinite(valor)) return "—";
    return valor.toLocaleString("es", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimales === undefined ? 2 : decimales
    });
  }

  function formatearDinero(valor, decimales) {
    return moneda + " " + formatearNumero(valor, decimales);
  }

  /* Valida un producto y devuelve { ok, error }. */
  function validar(producto) {
    if (!producto || !String(producto.nombre || "").trim()) {
      return { ok: false, error: "Ponle un nombre al producto." };
    }
    var precio = Number(producto.precio);
    var cantidad = Number(producto.cantidad);
    if (!isFinite(precio) || precio <= 0) {
      return { ok: false, error: "El precio debe ser un número mayor que cero." };
    }
    if (!isFinite(cantidad) || cantidad <= 0) {
      return { ok: false, error: "La cantidad debe ser un número mayor que cero." };
    }
    if (!UNIDADES[producto.unidad]) {
      return { ok: false, error: "Elige una unidad de medida válida." };
    }
    return { ok: true, error: "" };
  }

  /* Precio por unidad base (por kg, por L, por unidad, por m). */
  function precioPorUnidad(producto) {
    var unidad = UNIDADES[producto.unidad];
    var envases = Number(producto.envases) > 0 ? Number(producto.envases) : 1;
    var contenido = Number(producto.cantidad) * unidad.factor * envases;
    if (!contenido) return Infinity;
    return Number(producto.precio) / contenido;
  }

  function unidadBase(producto) {
    var unidad = UNIDADES[producto.unidad];
    return unidad ? unidad.base : "unidad";
  }

  function familia(producto) {
    var unidad = UNIDADES[producto.unidad];
    return unidad ? unidad.familia : "cantidad";
  }

  /* Compara una lista de productos.
     Devuelve la lista ordenada de más barato a más caro, con el ahorro
     porcentual de cada uno respecto del mejor precio.
     Sólo se comparan entre sí los productos de la misma familia de unidades. */
  function comparar(productos) {
    var validos = (productos || []).filter(function (p) {
      return validar(p).ok;
    });

    var resultados = validos.map(function (producto) {
      return {
        producto: producto,
        porUnidad: precioPorUnidad(producto),
        base: unidadBase(producto),
        familia: familia(producto),
        mejor: false,
        sobreprecio: 0
      };
    });

    /* El mejor precio se calcula dentro de cada familia de unidades. */
    var mejorPorFamilia = {};
    resultados.forEach(function (r) {
      if (mejorPorFamilia[r.familia] === undefined || r.porUnidad < mejorPorFamilia[r.familia]) {
        mejorPorFamilia[r.familia] = r.porUnidad;
      }
    });

    resultados.forEach(function (r) {
      var mejor = mejorPorFamilia[r.familia];
      r.mejor = r.porUnidad === mejor;
      r.sobreprecio = mejor > 0 ? ((r.porUnidad - mejor) / mejor) * 100 : 0;
    });

    resultados.sort(function (a, b) {
      if (a.familia !== b.familia) return a.familia < b.familia ? -1 : 1;
      return a.porUnidad - b.porUnidad;
    });

    return resultados;
  }

  /* Frase corta con el veredicto: siempre dentro de una misma familia
     de unidades, porque comparar $/kg con $/L no significa nada. */
  function veredicto(resultados) {
    if (!resultados.length) return "Agrega al menos un producto para comparar.";

    var grupos = {};
    resultados.forEach(function (r) {
      (grupos[r.familia] = grupos[r.familia] || []).push(r);
    });
    var familias = Object.keys(grupos);
    var nota = familias.length > 1
      ? " (los productos de distinta medida se comparan por separado)"
      : "";

    /* Nos quedamos con el grupo donde la decisión importa más. */
    var elegido = null;
    var mayorDiferencia = -1;
    familias.forEach(function (nombre) {
      var grupo = grupos[nombre];
      var mejor = grupo[0];
      var peor = grupo[grupo.length - 1];
      var diferencia = mejor.porUnidad > 0
        ? ((peor.porUnidad - mejor.porUnidad) / mejor.porUnidad) * 100
        : 0;
      if (diferencia > mayorDiferencia) {
        mayorDiferencia = diferencia;
        elegido = { grupo: grupo, mejor: mejor, peor: peor, diferencia: diferencia };
      }
    });

    if (elegido.grupo.length === 1) {
      return "«" + elegido.mejor.producto.nombre + "» sale a " +
             formatearDinero(elegido.mejor.porUnidad) + " por " +
             elegido.mejor.base + "." + nota;
    }
    if (elegido.diferencia === 0) {
      return "Todos cuestan lo mismo por " + elegido.mejor.base +
             ". Elige el que prefieras." + nota;
    }
    return "Conviene «" + elegido.mejor.producto.nombre + "»: es " +
           formatearNumero(elegido.diferencia, 1) + " % más barato por " +
           elegido.mejor.base + " que «" + elegido.peor.producto.nombre + "»." + nota;
  }

  /* Guardado local (la app y la web recuerdan la última lista). */
  function guardar(clave, productos) {
    try {
      global.localStorage.setItem(clave, JSON.stringify(productos));
      return true;
    } catch (e) {
      return false;
    }
  }

  function leer(clave) {
    try {
      var crudo = global.localStorage.getItem(clave);
      var lista = crudo ? JSON.parse(crudo) : [];
      return Array.isArray(lista) ? lista : [];
    } catch (e) {
      return [];
    }
  }

  global.Comparador = {
    UNIDADES: UNIDADES,
    definirMoneda: definirMoneda,
    formatearNumero: formatearNumero,
    formatearDinero: formatearDinero,
    validar: validar,
    precioPorUnidad: precioPorUnidad,
    unidadBase: unidadBase,
    comparar: comparar,
    veredicto: veredicto,
    guardar: guardar,
    leer: leer
  };
})(window);
