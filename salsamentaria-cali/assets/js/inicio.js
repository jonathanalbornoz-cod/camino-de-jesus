/* ==========================================================================
   inicio.js — vitrina de productos con filtros y calculadora "Armá tu bandeja"
   Se usa `const` por defecto; `let` solo donde hay reasignación real.
   ========================================================================== */

'use strict';

(() => {
  /* ----------------------------- Datos ----------------------------- */

  const PRODUCTOS = Object.freeze([
    { emoji: '🌭', categoria: 'Embutidos', nombre: 'Chorizo santarrosano de la casa', descripcion: 'Molido grueso, con cebolla larga del Valle y un toque de comino. El más pedido de los viernes.', precio: 16900, unidad: 'la libra (6 unidades)', estrella: 'Favorito del barrio' },
    { emoji: '🥓', categoria: 'Embutidos', nombre: 'Tocineta ahumada en leña', descripcion: 'Ahumada 8 horas con madera de guayabo. La cortamos gruesa o finita, como la quieras.', precio: 21500, unidad: 'la libra' },
    { emoji: '🍖', categoria: 'Embutidos', nombre: 'Morcilla rellena caleña', descripcion: 'Con arroz, arveja y hierbas. Receta de la abuela Carmen, sin cambios desde 2008.', precio: 12400, unidad: 'la libra' },
    { emoji: '🧀', categoria: 'Quesos', nombre: 'Queso doble crema', descripcion: 'Fresco, de finca en Ansermanuevo. Ideal para el pandebono o para derretir en la parrilla.', precio: 18200, unidad: 'la libra', estrella: 'Llega los martes y viernes' },
    { emoji: '🧀', categoria: 'Quesos', nombre: 'Queso campesino bajo en sal', descripcion: 'Suave y liviano, perfecto para el desayuno o para las dietas de la casa.', precio: 15600, unidad: 'la libra' },
    { emoji: '🫕', categoria: 'Quesos', nombre: 'Quesillo vallecaucano', descripcion: 'Hilado a mano y envuelto en hoja de plátano. Se acaba temprano, encargalo.', precio: 22800, unidad: 'la libra' },
    { emoji: '🥩', categoria: 'Carnes', nombre: 'Punta de anca madurada', descripcion: 'Res de 24 meses, madurada 21 días. La porcionamos del grosor que pidas.', precio: 34500, unidad: 'la libra', estrella: 'Corte estrella del asado' },
    { emoji: '🥩', categoria: 'Carnes', nombre: 'Sobrebarriga para el sudado', descripcion: 'Limpia y sin exceso de grasa, lista para la olla del domingo.', precio: 19900, unidad: 'la libra' },
    { emoji: '🍗', categoria: 'Carnes', nombre: 'Pechuga de pollo campesino', descripcion: 'Sin piel, fileteada o entera. También la dejamos apanada si avisás con un día.', precio: 13800, unidad: 'la libra' },
    { emoji: '🐖', categoria: 'Carnes', nombre: 'Costilla de cerdo BBQ', descripcion: 'Marinada en casa con panela y ají dulce. Solo va al horno o a la parrilla.', precio: 23400, unidad: 'la libra' },
    { emoji: '🥪', categoria: 'Fiambres', nombre: 'Jamón de pierna tajado', descripcion: 'Tajado al momento en la máquina, grueso o de papel. Nada de bandejas viejas.', precio: 17300, unidad: 'la libra' },
    { emoji: '🥓', categoria: 'Fiambres', nombre: 'Salami italiano curado', descripcion: 'Curado 60 días, con pimienta negra entera. Va perfecto en tabla de picada.', precio: 28600, unidad: 'la libra' },
    { emoji: '🫙', categoria: 'Salsas y encurtidos', nombre: 'Ají casero de la casa', descripcion: 'Picante medio, con cilantro cimarrón y limón. Frasco de 250 ml.', precio: 8500, unidad: 'el frasco' },
    { emoji: '🥫', categoria: 'Salsas y encurtidos', nombre: 'Chimichurri fresco', descripcion: 'Preparado cada mañana. Se conserva refrigerado hasta 10 días.', precio: 9800, unidad: 'el frasco' },
    { emoji: '🥒', categoria: 'Salsas y encurtidos', nombre: 'Encurtido de cebolla y ají', descripcion: 'El acompañante obligado del chorizo. Agridulce y crocante.', precio: 7600, unidad: 'el frasco' },
    { emoji: '🧺', categoria: 'Bandejas', nombre: 'Bandeja picada para 6', descripcion: 'Chorizo, salami, jamón, dos quesos, encurtidos y pan. Lista en 2 horas.', precio: 98000, unidad: 'la bandeja', estrella: 'La favorita para reuniones' },
    { emoji: '🎁', categoria: 'Bandejas', nombre: 'Canasta empresarial', descripcion: 'Selección de quesos, embutidos y salsas con tarjeta personalizada. Facturamos con NIT.', precio: 165000, unidad: 'la canasta' }
  ]);

  const INGREDIENTES_BANDEJA = Object.freeze([
    { id: 'res', emoji: '🥩', nombre: 'Punta de anca', detalle: '250 g por persona', porPersona: 19000 },
    { id: 'cerdo', emoji: '🐖', nombre: 'Costilla de cerdo', detalle: '200 g por persona', porPersona: 10300 },
    { id: 'pollo', emoji: '🍗', nombre: 'Pollo marinado', detalle: '200 g por persona', porPersona: 6100 },
    { id: 'chorizo', emoji: '🌭', nombre: 'Chorizo de la casa', detalle: '1 unidad por persona', porPersona: 2900 },
    { id: 'morcilla', emoji: '🍖', nombre: 'Morcilla rellena', detalle: '1 unidad por persona', porPersona: 2200 },
    { id: 'queso', emoji: '🧀', nombre: 'Queso para asar', detalle: '80 g por persona', porPersona: 3200 },
    { id: 'papa', emoji: '🥔', nombre: 'Papa criolla y arepa', detalle: 'Acompañamiento', porPersona: 2600 },
    { id: 'salsas', emoji: '🫙', nombre: 'Trío de salsas', detalle: 'Ají, chimichurri y encurtido', porPersona: 1500 }
  ]);

  const CATEGORIAS = ['Todo', ...new Set(PRODUCTOS.map((producto) => producto.categoria))];

  /* ------------------------- Vitrina de productos ------------------------- */

  const rejilla = document.getElementById('rejilla-productos');
  const contenedorFiltros = document.getElementById('filtros');
  const avisoVacio = document.getElementById('aviso-vacio');

  const construirTarjeta = (producto) => {
    const tarjeta = Salsa.crear('article', 'producto');

    const icono = Salsa.crear('div', 'producto__emoji', producto.emoji);
    icono.setAttribute('aria-hidden', 'true');

    const precio = Salsa.crear('p', 'producto__precio');
    precio.appendChild(document.createTextNode(Salsa.enPesos(producto.precio)));
    precio.appendChild(Salsa.crear('span', '', ` · ${producto.unidad}`));

    tarjeta.append(
      icono,
      Salsa.crear('span', 'producto__categoria', producto.categoria),
      Salsa.crear('h3', '', producto.nombre),
      Salsa.crear('p', '', producto.descripcion)
    );

    if (producto.estrella) {
      tarjeta.appendChild(Salsa.crear('p', 'producto__estrella', `⭐ ${producto.estrella}`));
    }

    tarjeta.appendChild(precio);
    return tarjeta;
  };

  const pintarProductos = (categoria) => {
    if (!rejilla) { return; }

    const visibles = categoria === 'Todo'
      ? PRODUCTOS
      : PRODUCTOS.filter((producto) => producto.categoria === categoria);

    rejilla.textContent = '';
    visibles.forEach((producto) => rejilla.appendChild(construirTarjeta(producto)));

    if (avisoVacio) { avisoVacio.hidden = visibles.length > 0; }
  };

  const construirFiltros = () => {
    if (!contenedorFiltros) { return; }

    CATEGORIAS.forEach((categoria, indice) => {
      const boton = Salsa.crear('button', 'filtro', categoria);
      boton.type = 'button';
      boton.setAttribute('aria-pressed', String(indice === 0));

      boton.addEventListener('click', () => {
        contenedorFiltros.querySelectorAll('.filtro').forEach((otro) => {
          otro.setAttribute('aria-pressed', String(otro === boton));
        });
        pintarProductos(categoria);
      });

      contenedorFiltros.appendChild(boton);
    });
  };

  /* --------------------- Calculadora "Armá tu bandeja" --------------------- */

  const contenedorOpciones = document.getElementById('opciones-bandeja');
  const detalleBandeja = document.getElementById('detalle-bandeja');
  const totalBandeja = document.getElementById('total-bandeja');
  const deslizadorPersonas = document.getElementById('personas');
  const textoPersonas = document.getElementById('texto-personas');

  /* Selección inicial sugerida: lo típico de un asado caleño. */
  const seleccion = new Set(['res', 'chorizo', 'papa', 'salsas']);

  const calcularBandeja = () => {
    if (!detalleBandeja || !totalBandeja || !deslizadorPersonas) { return; }

    const personas = Number(deslizadorPersonas.value);
    let total = 0;

    detalleBandeja.textContent = '';

    if (seleccion.size === 0) {
      const vacio = Salsa.crear('li', '', 'Todavía no has elegido nada 🙂');
      detalleBandeja.appendChild(vacio);
    }

    INGREDIENTES_BANDEJA.forEach((ingrediente) => {
      if (!seleccion.has(ingrediente.id)) { return; }

      const subtotal = ingrediente.porPersona * personas;
      total += subtotal;

      const fila = Salsa.crear('li');
      fila.append(
        Salsa.crear('span', '', `${ingrediente.emoji} ${ingrediente.nombre}`),
        Salsa.crear('span', '', Salsa.enPesos(subtotal))
      );
      detalleBandeja.appendChild(fila);
    });

    totalBandeja.textContent = Salsa.enPesos(total);

    if (textoPersonas) {
      const porPersona = personas > 0 ? total / personas : 0;
      textoPersonas.textContent =
        `${personas} personas · ${Salsa.enPesos(porPersona)} por persona`;
    }
  };

  const construirOpcionesBandeja = () => {
    if (!contenedorOpciones) { return; }

    INGREDIENTES_BANDEJA.forEach((ingrediente) => {
      const etiqueta = Salsa.crear('label', 'opcion');

      const casilla = document.createElement('input');
      casilla.type = 'checkbox';
      casilla.value = ingrediente.id;
      casilla.checked = seleccion.has(ingrediente.id);
      casilla.addEventListener('change', () => {
        if (casilla.checked) {
          seleccion.add(ingrediente.id);
        } else {
          seleccion.delete(ingrediente.id);
        }
        calcularBandeja();
      });

      const texto = Salsa.crear('span');
      texto.append(
        Salsa.crear('b', '', `${ingrediente.emoji} ${ingrediente.nombre}`),
        Salsa.crear('small', '', ingrediente.detalle)
      );

      etiqueta.append(casilla, texto);
      contenedorOpciones.appendChild(etiqueta);
    });
  };

  /* ------------------------------ Arranque ------------------------------ */

  document.addEventListener('DOMContentLoaded', () => {
    construirFiltros();
    pintarProductos('Todo');
    construirOpcionesBandeja();

    if (deslizadorPersonas) {
      deslizadorPersonas.addEventListener('input', calcularBandeja);
    }
    calcularBandeja();
  });
})();
