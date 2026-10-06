/*
 * Quesera Chiminangos — contenido del sitio
 * ------------------------------------------------------------------
 * Todo lo editable vive aquí. Para cambiar el catálogo o los datos de
 * contacto no hace falta tocar el HTML ni el CSS.
 *
 * Fuentes: brief de Injoe Agencia, «Categorías productos Quesera
 * Chiminangos.pdf» y las fotos de producto (de ahí salen las marcas y
 * los gramajes: están impresos en cada empaque).
 *
 * Lo que sigue en PENDIENTE lo tiene que confirmar el cliente.
 */

const MARCA = {
  nombre: 'Quesera Chiminangos',
  eslogan: 'Salsamentaria',
  promesa: 'Todo para su cocina en un solo lugar: quesos, carnes frías, congelados y desechables.',
  descripcion:
    'Somos una salsamentaria de Cali que surte a hogares, restaurantes, ' +
    'panaderías y negocios de comida. Manejamos un portafolio amplio —de los ' +
    'quesos frescos a los empaques desechables— para que no tenga que pedirle ' +
    'a cinco proveedores lo que le podemos despachar nosotros.',

  contacto: 'Alejandra Giraldo',
  cargo: 'Administradora',

  // Número de WhatsApp: 57 + los 10 dígitos del celular
  whatsapp: '573146440355',
  whatsappVisible: '314 644 0355',
  // Fijo que aparece en el logotipo
  telefono: '446 6561',
  correo: 'queserasalsamentariachimi@gmail.com',

  direccion: 'Calle 44 #1C-25, barrio Chiminangos',
  ciudad: 'Cali, Colombia',
  horario: 'PENDIENTE — horarios de atención',

  // Mapa. Esta URL busca la dirección en Google Maps; sirve sin necesidad de
  // una clave de API. Si el pin no cae exacto, se reemplaza por el iframe de
  // Google Maps → Compartir → Insertar un mapa → copiar sólo el src.
  mapaEmbed: 'https://www.google.com/maps?q=Calle%2044%20%231C-25%2C%20Chiminangos%2C%20Cali%2C%20Valle%20del%20Cauca%2C%20Colombia&output=embed',

  // Perfiles de redes. Los vacíos no se dibujan.
  instagram: '',
  facebook: '',
  tiktok: '',

  logo: 'imagenes/logo.webp',
};

/* La franja de sellos bajo la portada */
const SELLOS = [
  { icono: 'catalogo',  titulo: 'Portafolio amplio',   texto: 'Once líneas de producto en un solo proveedor.' },
  { icono: 'mayor',     titulo: 'Detal y por mayor',   texto: 'Atendemos al hogar y al negocio de comida.' },
  { icono: 'frio',      titulo: 'Cadena de frío',      texto: 'Refrigerados y congelados manejados como toca.' },
  { icono: 'whatsapp',  titulo: 'Pedido por WhatsApp', texto: 'Arme su lista y se la cotizamos al momento.' },
];

/*
 * Categorías del catálogo, en el orden en que salen los filtros.
 * Vienen del PDF de categorías del cliente.
 */
const CATEGORIAS = [
  { id: 'quesos',      nombre: 'Quesos',                 icono: 'queso' },
  { id: 'carnes',      nombre: 'Carnes y embutidos',     icono: 'carne' },
  { id: 'congelados',  nombre: 'Congelados',             icono: 'frio' },
  { id: 'desechables', nombre: 'Desechables y empaques', icono: 'caja' },
  { id: 'salsas',      nombre: 'Salsas y aderezos',      icono: 'salsa' },
  { id: 'reposteria',  nombre: 'Panadería y repostería', icono: 'reposteria' },
  { id: 'panes',       nombre: 'Panes',                  icono: 'pan' },
  { id: 'aceites',     nombre: 'Aceites',                icono: 'aceite' },
  { id: 'condimentos', nombre: 'Condimentos',            icono: 'condimento' },
  { id: 'lacteos',     nombre: 'Lácteos',                icono: 'leche' },
  { id: 'enlatados',   nombre: 'Enlatados',              icono: 'lata' },
];

/*
 * El catálogo. Campos de cada producto:
 *
 *   id            único, sin tildes ni espacios
 *   nombre        como va escrito en el pedido de WhatsApp
 *   categoria     un id de CATEGORIAS
 *   marca         opcional; sale como sello sobre la foto
 *   presentacion  opcional; si está vacío la tarjeta no muestra esa línea
 *   descripcion   una línea, corta
 *   imagen        ruta de la foto; vacío = ilustración de la categoría
 *   destacado     true lo sube al comienzo del catálogo
 *
 * SIN PRECIOS: es decisión del brief. El precio se da por WhatsApp.
 *
 * Las presentaciones que están puestas salen del empaque en la foto o del
 * PDF de categorías. Las que faltan las tiene que confirmar el cliente.
 */
const PRODUCTOS = [

  /* ---------------- Quesos ---------------- */
  {
    id: 'queso-campesino', nombre: 'Queso campesino', categoria: 'quesos',
    descripcion: 'Fresco y de sal suave, el de la arepa y el desayuno.',
    presentacion: '', imagen: 'imagenes/productos/queso-campesino.webp', destacado: true,
  },
  {
    id: 'queso-cuajada', nombre: 'Queso cuajada', categoria: 'quesos',
    descripcion: 'Cuajada fresca, para acompañar con melao o bocadillo.',
    presentacion: '', imagen: 'imagenes/productos/queso-cuajada.webp', destacado: true,
  },
  {
    id: 'queso-mozzarella', nombre: 'Queso mozzarella', categoria: 'quesos',
    descripcion: 'El que estira en la pizza, la lasaña y el sánduche caliente.',
    presentacion: '', imagen: 'imagenes/productos/queso-mozarella.webp', destacado: true,
  },
  {
    id: 'queso-costeno', nombre: 'Queso costeño', categoria: 'quesos',
    descripcion: 'Salado y firme, para rallar sobre el sancocho o el arroz.',
    presentacion: '', imagen: 'imagenes/productos/queso-costeno.webp', destacado: false,
  },
  {
    id: 'queso-cheddar', nombre: 'Queso cheddar', categoria: 'quesos',
    descripcion: 'En lonjas, para hamburguesas y sánduches.',
    presentacion: '', imagen: 'imagenes/productos/queso-cheddar.webp', destacado: false,
  },

  /* ---------------- Carnes y embutidos ---------------- */
  {
    id: 'costilla', nombre: 'Costilla ahumada', categoria: 'carnes',
    descripcion: 'Ahumada de verdad, lista para hornear o para el asado.',
    presentacion: '', imagen: 'imagenes/productos/costilla-ahumada.webp', destacado: true,
  },
  {
    id: 'carne-hamburguesa', nombre: 'Carne para hamburguesa', categoria: 'carnes',
    marca: 'Zenú',
    descripcion: 'Congelada, va directo a la plancha sin descongelar.',
    presentacion: '500 g · 10 porciones', imagen: 'imagenes/productos/carne-hamburguesa.webp', destacado: true,
  },
  {
    id: 'salchicha-perro', nombre: 'Salchicha para perro', categoria: 'carnes',
    marca: 'Zenú',
    descripcion: 'Súper perro tipo americano, la de los negocios de comida rápida.',
    presentacion: '1.600 g · 20 unidades', imagen: 'imagenes/productos/salchicha-perro.webp', destacado: false,
  },
  {
    id: 'jamon', nombre: 'Jamón', categoria: 'carnes',
    marca: 'Rica Chef',
    descripcion: 'Tajado parejo, rinde para el sánduche y la picada.',
    presentacion: '500 g · 30 tajadas', imagen: 'imagenes/productos/jamon.webp', destacado: false,
  },
  {
    id: 'tocineta', nombre: 'Tocineta', categoria: 'carnes',
    marca: 'Titos',
    descripcion: 'De cerdo ahumada, en lonjas parejas.',
    presentacion: '900 g', imagen: 'imagenes/productos/tocineta.webp', destacado: false,
  },
  {
    id: 'chorizos', nombre: 'Chorizos', categoria: 'carnes',
    marca: 'El Paisa',
    descripcion: 'Chorizo santarrosano, para asar o freír.',
    presentacion: 'Paquete', imagen: 'imagenes/productos/chorizo-santarosano.webp', destacado: true,
  },
  {
    id: 'salchichones', nombre: 'Salchichones', categoria: 'carnes',
    marca: 'Calinnas',
    descripcion: 'Cervecero ahumado de res, en trozo para tajar.',
    presentacion: '1.000 g', imagen: 'imagenes/productos/salchichon-calimas.webp', destacado: false,
  },
  {
    id: 'manguera', nombre: 'Manguera', categoria: 'carnes',
    descripcion: 'Salchicha en rollo, para la bandeja, la picada y el asado.',
    presentacion: '', imagen: 'imagenes/productos/salchicha-manguera.webp', destacado: false,
  },

  /* ---------------- Congelados ---------------- */
  {
    id: 'papas-francesa', nombre: 'Papas a la francesa', categoria: 'congelados',
    marca: 'Bart\'s Tradition',
    descripcion: 'Prefritas congeladas, van directo al aceite.',
    presentacion: '2,5 kg · 31 porciones', imagen: 'imagenes/productos/papas-francesas-2-500g.webp', destacado: true,
  },
  {
    id: 'empanadas', nombre: 'Empanadas', categoria: 'congelados',
    marca: 'Jiménez',
    descripcion: 'Congeladas, listas para freír.',
    presentacion: '1.000 g · 20 porciones', imagen: 'imagenes/productos/empanadas.webp', destacado: true,
  },
  {
    id: 'maiz', nombre: 'Maíz dulce', categoria: 'congelados',
    descripcion: 'Desgranado, para ensaladas, cremas y guarniciones.',
    presentacion: '1.000 g', imagen: 'imagenes/productos/maiz-dulce.webp', destacado: false,
  },
  {
    id: 'mix-verduras', nombre: 'Mix de verduras', categoria: 'congelados',
    marca: 'Ricongelisto',
    descripcion: 'Arveja, zanahoria, maíz y habichuela, ya picados.',
    presentacion: '500 g', imagen: 'imagenes/productos/mix-de-verduras.webp', destacado: false,
  },
  {
    id: 'croquetas-yuca', nombre: 'Croquetas de yuca', categoria: 'congelados',
    descripcion: 'Congeladas, para freír al momento.',
    presentacion: '', imagen: '', destacado: false,
  },

  /* ---------------- Desechables y empaques ---------------- */
  {
    id: 'contenedores', nombre: 'Contenedores', categoria: 'desechables',
    descripcion: 'De icopor con tapa, para sopas, guisos y domicilios.',
    presentacion: '8 oz · 12 oz · 16 oz · 24 oz', imagen: 'imagenes/productos/contenedores-8-16-24oz.webp', destacado: true,
  },
  {
    id: 'portacomidas', nombre: 'Portacomidas', categoria: 'desechables',
    descripcion: 'De icopor con tapa y divisiones, para almuerzos y domicilios.',
    presentacion: 'C1 · J2 · P1 · K1', imagen: 'imagenes/productos/porta-comida-c1-k1-j2-p1.webp', destacado: false,
  },
  {
    id: 'platos-desechables', nombre: 'Platos desechables', categoria: 'desechables',
    marca: 'Wau!',
    descripcion: 'Plato pando de icopor, para eventos y para llevar.',
    presentacion: '23 cm · 20 unidades', imagen: 'imagenes/productos/plato-de-icopor.webp', destacado: false,
  },
  {
    id: 'vasos-desechables', nombre: 'Vasos desechables', categoria: 'desechables',
    marca: 'Wau!',
    descripcion: 'Vaso translúcido reciclable, para bebidas frías.',
    presentacion: '7 oz (207 ml) · 50 unidades', imagen: 'imagenes/productos/vaso-plastico.webp', destacado: false,
  },
  {
    id: 'servilletas', nombre: 'Servilletas', categoria: 'desechables',
    marca: 'Popular',
    descripcion: 'Servilleta partida, la de mayor rotación en el negocio.',
    presentacion: '300 unidades', imagen: 'imagenes/productos/servilleta-desechables.webp', destacado: false,
  },
  {
    id: 'moldes-aluminio', nombre: 'Moldes de aluminio', categoria: 'desechables',
    descripcion: 'Redondos y rectangulares, de la porción individual a la bandeja.',
    presentacion: 'Varios tamaños', imagen: 'imagenes/productos/moldes-de-aluminio.webp', destacado: false,
  },
  {
    id: 'copas-salseras', nombre: 'Copas salseras', categoria: 'desechables',
    descripcion: 'Para salsas y aderezos al empacar el domicilio.',
    presentacion: '', imagen: 'imagenes/productos/copa-salsera.webp', destacado: false,
  },
  {
    id: 'papel-aluminio', nombre: 'Papel aluminio', categoria: 'desechables',
    marca: 'House',
    descripcion: 'Rollo para horno, asado y para conservar.',
    presentacion: '100 m × 30 cm', imagen: 'imagenes/productos/papel-aluminio.webp', destacado: false,
  },

  /* ---------------- Salsas y aderezos ---------------- */
  {
    id: 'mayonesa-san-jorge', nombre: 'Aderezo de mayonesa', categoria: 'salsas',
    marca: 'San Jorge',
    descripcion: 'La base de la salsa de la casa, en presentación para negocio.',
    presentacion: '', imagen: 'imagenes/productos/aderezo-mayonesa.webp', destacado: true,
  },
  {
    id: 'vinagre', nombre: 'Vinagre blanco', categoria: 'salsas',
    marca: 'Distrivalle',
    descripcion: 'Para aderezos, encurtidos y limpieza de cocina.',
    presentacion: '3.000 ml', imagen: 'imagenes/productos/vinagre.webp', destacado: false,
  },
  {
    id: 'salsas-difier', nombre: 'Salsas Difier', categoria: 'salsas',
    marca: 'Difier',
    descripcion: 'Presentación institucional para negocios de comida.',
    presentacion: '4.000 g', imagen: '', destacado: false,
  },
  {
    id: 'pompeya-pina', nombre: 'Pompeya de piña', categoria: 'salsas',
    descripcion: 'Para repostería y para acompañar carnes.',
    presentacion: '', imagen: '', destacado: false,
  },
  {
    id: 'salsa-italiana', nombre: 'Salsa italiana', categoria: 'salsas',
    descripcion: 'Para pastas, lasañas y pizzas.',
    presentacion: '', imagen: '', destacado: false,
  },
  {
    id: 'salsa-bbq', nombre: 'Salsa BBQ', categoria: 'salsas',
    descripcion: 'Presentación para restaurante.',
    presentacion: '', imagen: '', destacado: false,
  },

  /* ---------------- Panadería y repostería ---------------- */
  {
    id: 'huevos', nombre: 'Huevos', categoria: 'reposteria',
    descripcion: 'AA y AAA, por panal o por cubeta.',
    presentacion: 'Panal de 30 unidades', imagen: 'imagenes/productos/huevos-aa-aaa.webp', destacado: true,
  },
  {
    id: 'harinas', nombre: 'Harina de trigo', categoria: 'reposteria',
    marca: 'Haz de Oros',
    descripcion: 'Fortificada tradicional, para panadería y amasijos.',
    presentacion: '2,5 kg', imagen: 'imagenes/productos/harina-de-trigo.webp', destacado: false,
  },
  {
    id: 'margarinas', nombre: 'Margarina', categoria: 'reposteria',
    marca: 'Astra',
    descripcion: 'Industrial para pastelería fina: hojaldre, ponqué y panadería.',
    presentacion: '', imagen: 'imagenes/productos/margarina-astra.webp', destacado: false,
  },
  {
    id: 'azucar', nombre: 'Azúcar blanco', categoria: 'reposteria',
    marca: 'La Cabaña',
    descripcion: 'Bulto para negocio; también se despacha por menor.',
    presentacion: '50 kg', imagen: 'imagenes/productos/azucar.webp', destacado: false,
  },
  {
    id: 'domos-torta', nombre: 'Domos para torta', categoria: 'reposteria',
    descripcion: 'Para transportar y exhibir la torta sin dañarla.',
    presentacion: '', imagen: 'imagenes/productos/domos-para-tortas.webp', destacado: false,
  },
  {
    id: 'esencias', nombre: 'Esencias', categoria: 'reposteria',
    descripcion: 'Vainilla, mantequilla, coco y más sabores para repostería.',
    presentacion: '', imagen: 'imagenes/productos/esencias-para-alimentos.webp', destacado: false,
  },

  /* ---------------- Panes ---------------- */
  {
    id: 'pan-hamburguesa', nombre: 'Pan para hamburguesa', categoria: 'panes',
    marca: 'Pan del Valle',
    descripcion: 'Tipo brioche, del tamaño que maneja la comida rápida.',
    presentacion: '', imagen: 'imagenes/productos/pan-hamburguesa.webp', destacado: false,
  },
  {
    id: 'pan-perro', nombre: 'Pan para perro', categoria: 'panes',
    marca: 'Bimbo',
    descripcion: 'Suave y parejo, aguanta la salsa.',
    presentacion: '10 unidades', imagen: 'imagenes/productos/pan-perro.webp', destacado: false,
  },
  {
    id: 'pan-tajado', nombre: 'Pan tajado', categoria: 'panes',
    marca: 'Pan Pullman',
    descripcion: 'Para sánduches y desayunos.',
    presentacion: '680 g', imagen: 'imagenes/productos/pan-tajado.webp', destacado: false,
  },
  {
    id: 'pan-colita', nombre: 'Pan colita', categoria: 'panes',
    descripcion: 'El clásico para el sánduche cubano y la picada.',
    presentacion: '', imagen: '', destacado: false,
  },

  /* ---------------- Aceites ---------------- */
  {
    id: 'aceite-industrial', nombre: 'Aceite industrial', categoria: 'aceites',
    marca: 'Celestial',
    descripcion: 'Oleína de palma alto oleico, para freidora de negocio.',
    presentacion: '19 litros', imagen: 'imagenes/productos/aceite-industrial-19lts.webp', destacado: true,
  },
  {
    id: 'aceite-galon', nombre: 'Aceite de palma en garrafa', categoria: 'aceites',
    marca: 'Palma de Oro',
    descripcion: 'El intermedio: casa grande o negocio pequeño.',
    presentacion: '5.000 ml', imagen: 'imagenes/productos/aceite-de-palma-5000ml.webp', destacado: false,
  },
  {
    id: 'aceite-cocina', nombre: 'Aceite de cocina', categoria: 'aceites',
    marca: 'Kindom',
    descripcion: 'La presentación de siempre para la casa.',
    presentacion: '1.000 ml', imagen: 'imagenes/productos/aceite-kindom-1000ml.webp', destacado: false,
  },

  /* ---------------- Condimentos ---------------- */
  {
    id: 'color', nombre: 'Color', categoria: 'condimentos',
    descripcion: 'Para el arroz, el guiso y la sopa.',
    presentacion: '', imagen: '', destacado: false,
  },
  {
    id: 'acento', nombre: 'Acento', categoria: 'condimentos',
    descripcion: 'Sazonador de uso diario en cocina.',
    presentacion: '', imagen: '', destacado: false,
  },
  {
    id: 'comino', nombre: 'Comino', categoria: 'condimentos',
    descripcion: 'Molido, para carnes y sopas.',
    presentacion: '', imagen: '', destacado: false,
  },

  /* ---------------- Lácteos ---------------- */
  {
    id: 'leche', nombre: 'Leche entera', categoria: 'lacteos',
    marca: 'Alquería',
    descripcion: 'En bolsa, para la casa y para el negocio.',
    presentacion: 'Megalitro', imagen: 'imagenes/productos/leche-entera.webp', destacado: false,
  },
  {
    id: 'crema-leche', nombre: 'Crema de leche', categoria: 'lacteos',
    marca: 'Mr Quick',
    descripcion: 'Para salsas, postres y repostería.',
    presentacion: '900 ml', imagen: 'imagenes/productos/crema-de-leche.webp', destacado: false,
  },
  {
    id: 'yogur', nombre: 'Yogur', categoria: 'lacteos',
    marca: 'Lactodelicias',
    descripcion: 'Sabor melocotón, con probióticos.',
    presentacion: '1.750 g · 8 porciones', imagen: 'imagenes/productos/yogurt.webp', destacado: false,
  },

  /* ---------------- Enlatados ---------------- */
  {
    id: 'atun', nombre: 'Atún', categoria: 'enlatados',
    marca: 'Isabel',
    descripcion: 'Atún claro en lomitos, en aceite de girasol o en agua.',
    presentacion: '', imagen: 'imagenes/productos/atun-isabel.webp', destacado: true,
  },
  {
    id: 'frijoles-enlatados', nombre: 'Frijoles antioqueños', categoria: 'enlatados',
    marca: 'Zenú',
    descripcion: 'Listos para calentar y servir.',
    presentacion: '310 g · 2 porciones', imagen: 'imagenes/productos/frijoles-enlatados.webp', destacado: false,
  },
  {
    id: 'arveja-zanahoria', nombre: 'Arveja con zanahoria', categoria: 'enlatados',
    marca: 'San Jorge',
    descripcion: 'Enlatada, lista para la ensalada o el arroz.',
    presentacion: '', imagen: 'imagenes/productos/arveja-y-zanahoria-enlatada.webp', destacado: false,
  },
];
