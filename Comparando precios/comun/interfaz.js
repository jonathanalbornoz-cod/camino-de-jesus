/* ---------------------------------------------------------------
   Comparando precios — interfaz del comparador.
   Se monta dentro de cualquier contenedor, así la web y la app
   comparten exactamente la misma herramienta.
--------------------------------------------------------------- */
(function (global) {
  "use strict";

  var Comparador = global.Comparador;

  function crear(etiqueta, atributos, hijos) {
    var nodo = document.createElement(etiqueta);
    Object.keys(atributos || {}).forEach(function (clave) {
      if (clave === "clase") nodo.className = atributos[clave];
      else if (clave === "texto") nodo.textContent = atributos[clave];
      else nodo.setAttribute(clave, atributos[clave]);
    });
    (hijos || []).forEach(function (hijo) { nodo.appendChild(hijo); });
    return nodo;
  }

  function opcionesDeUnidad() {
    return Object.keys(Comparador.UNIDADES).map(function (clave) {
      var opcion = document.createElement("option");
      opcion.value = clave;
      opcion.textContent = Comparador.UNIDADES[clave].etiqueta;
      return opcion;
    });
  }

  /* opciones: { raiz, clave } */
  function montar(opciones) {
    var raiz = typeof opciones.raiz === "string"
      ? document.querySelector(opciones.raiz)
      : opciones.raiz;
    if (!raiz) return null;

    var clave = opciones.clave || "comparando-precios";
    var productos = Comparador.leer(clave);

    /* ---- Formulario ---- */
    var nombre = crear("input", { type: "text", id: "cp-nombre", placeholder: "Ej.: Arroz marca X", autocomplete: "off" });
    var precio = crear("input", { type: "number", id: "cp-precio", min: "0", step: "any", inputmode: "decimal", placeholder: "0" });
    var cantidad = crear("input", { type: "number", id: "cp-cantidad", min: "0", step: "any", inputmode: "decimal", placeholder: "0" });
    var unidad = crear("select", { id: "cp-unidad" });
    opcionesDeUnidad().forEach(function (o) { unidad.appendChild(o); });
    unidad.value = "g";
    var envases = crear("input", { type: "number", id: "cp-envases", min: "1", step: "1", inputmode: "numeric", value: "1" });

    var aviso = crear("p", { clase: "aviso", role: "status" });
    var agregar = crear("button", { clase: "boton-principal", type: "submit", texto: "Agregar y comparar" });

    function campo(etiquetaTexto, control, ayuda) {
      var etiqueta = crear("label", { for: control.id, texto: etiquetaTexto });
      var contenedor = crear("div", { clase: "campo" }, [etiqueta, control]);
      if (ayuda) contenedor.appendChild(crear("small", { clase: "item-detalle", texto: ayuda }));
      return contenedor;
    }

    var formulario = crear("form", { clase: "tarjeta", autocomplete: "off" }, [
      campo("Producto", nombre),
      crear("div", { clase: "fila" }, [
        campo("Precio total", precio),
        campo("Contenido", cantidad),
        campo("Unidad", unidad)
      ]),
      campo("Envases en el pack", envases, "Deja 1 si es un solo envase."),
      aviso,
      agregar
    ]);

    /* ---- Resultados ---- */
    var veredicto = crear("p", { clase: "veredicto" });
    var lista = crear("ul", { clase: "lista" });
    var limpiar = crear("button", { clase: "boton-secundario", type: "button", texto: "Vaciar la lista" });
    var resultados = crear("section", { clase: "resultados" }, [veredicto, lista, limpiar]);

    raiz.appendChild(formulario);
    raiz.appendChild(resultados);

    function pintar() {
      var comparacion = Comparador.comparar(productos);
      veredicto.textContent = Comparador.veredicto(comparacion);
      lista.textContent = "";
      limpiar.style.display = productos.length ? "" : "none";

      if (!comparacion.length) {
        lista.appendChild(crear("li", {
          clase: "vacio",
          texto: "Todavía no hay productos. Agrega el primero arriba."
        }));
        return;
      }

      comparacion.forEach(function (resultado) {
        var p = resultado.producto;
        var paquete = Number(p.envases) > 1 ? " · " + p.envases + " envases" : "";
        var detalle = Comparador.formatearDinero(p.precio) + " · " +
                      Comparador.formatearNumero(p.cantidad) + " " +
                      Comparador.UNIDADES[p.unidad].etiqueta + paquete;

        var nombreNodo = crear("div", { clase: "item-nombre", texto: p.nombre });
        if (resultado.mejor) {
          nombreNodo.appendChild(crear("span", { clase: "etiqueta-mejor", texto: "Mejor precio" }));
        }

        var precioNodo = crear("div", { clase: "item-precio" }, [
          crear("div", {
            clase: "item-unitario",
            texto: Comparador.formatearDinero(resultado.porUnidad) + "/" + resultado.base
          })
        ]);
        if (!resultado.mejor) {
          precioNodo.appendChild(crear("div", {
            clase: "item-sobreprecio",
            texto: "+" + Comparador.formatearNumero(resultado.sobreprecio, 1) + " %"
          }));
        }

        var quitar = crear("button", {
          clase: "quitar",
          type: "button",
          title: "Quitar " + p.nombre,
          "aria-label": "Quitar " + p.nombre,
          texto: "✕"
        });
        quitar.addEventListener("click", function () {
          productos = productos.filter(function (otro) { return otro !== p; });
          Comparador.guardar(clave, productos);
          pintar();
        });

        lista.appendChild(crear("li", {
          clase: "item" + (resultado.mejor ? " ganador" : "")
        }, [
          crear("div", { clase: "item-datos" }, [
            nombreNodo,
            crear("div", { clase: "item-detalle", texto: detalle })
          ]),
          precioNodo,
          quitar
        ]));
      });
    }

    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      var producto = {
        nombre: nombre.value.trim(),
        precio: Number(precio.value),
        cantidad: Number(cantidad.value),
        unidad: unidad.value,
        envases: Number(envases.value) || 1
      };
      var revision = Comparador.validar(producto);
      aviso.textContent = revision.error;
      if (!revision.ok) return;

      productos.push(producto);
      Comparador.guardar(clave, productos);
      pintar();

      nombre.value = "";
      precio.value = "";
      cantidad.value = "";
      envases.value = "1";
      nombre.focus();
    });

    limpiar.addEventListener("click", function () {
      productos = [];
      Comparador.guardar(clave, productos);
      pintar();
    });

    pintar();
    return { pintar: pintar };
  }

  global.Interfaz = { montar: montar };
})(window);
