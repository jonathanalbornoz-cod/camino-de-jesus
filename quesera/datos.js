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
  promesa: 'Variedad, disponibilidad y los mejores precios, aquí.',
  // La franja bajo los botones de la portada
  lineas: 'Carnes frías · Lácteos · Desechables · Repostería y más.',
  descripcion:
    'Con más de 20 años caracterizándonos por el buen servicio. Somos una ' +
    'salsamentaría ubicada en La Chimisexta, donde encuentras todo para tu ' +
    'hogar o negocio.',

  contacto: 'Alejandra Giraldo',
  cargo: 'Administradora',

  // Número de WhatsApp: 57 + los 10 dígitos del celular
  whatsapp: '573146440355',
  whatsappVisible: '314 644 0355',
  // Fijo que aparece en el logotipo
  telefono: '446 6561',
  correo: 'queserasalsamentariachimi@gmail.com',

  direccion: 'Calle 62B #1A9-250, barrio Chiminangos II',
  ciudad: 'Cali, Colombia',
  horario: 'Lunes a sábado 7:00 a.m. – 9:00 p.m. · Domingos y lunes festivos 7:00 a.m. – 2:00 p.m.',

  // Mapa. Es el embed oficial de la ficha del negocio en Google Maps
  // (place id 0x8e30a7513b8e757d:0x17a64a51b76f1f04), por eso el puntero sale
  // con el nombre «QUESERA CHIMINAGOS» y no como unas coordenadas sueltas.
  // No se usa la dirección en texto porque Google geocodifica
  // «Calle 62B #1A9-250» unos 60 metros al oriente, en la cuadra de al lado.
  mapaEmbed: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d497.8091068327769!2d-76.4932186!3d3.4772618!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a7513b8e757d%3A0x17a64a51b76f1f04!2sQUESERA%20CHIMINAGOS!5e0!3m2!1ses!2sco!4v1792377432870!5m2!1ses!2sco',


  logo: 'imagenes/logo.webp',
};

/*
 * Redes sociales. Se dibujan en la sección del final y en contacto; las que
 * se quiten de aquí desaparecen solas de los dos sitios.
 */
const REDES = [
  { id: 'instagram', nombre: 'Instagram', usuario: '@quesera_chiminangos',
    url: 'https://www.instagram.com/quesera_chiminangos/' },
  { id: 'facebook',  nombre: 'Facebook',  usuario: 'Quesera Chiminangos',
    url: 'https://www.facebook.com/quesera.chiminangos/' },
  { id: 'tiktok',    nombre: 'TikTok',    usuario: '@queserachiminangos',
    url: 'https://www.tiktok.com/@queserachiminangos' },
];

/* La franja de sellos bajo la portada */
/*
 * Empresas aliadas. Los logos van al final, antes del pie. Para agregar una
 * se copia su logo a imagenes/aliados/ y se añade aquí; si alguna vez tienen
 * sitio o red, se le pone «url» y el logo se vuelve enlace solo.
 */
const ALIADOS = [
  { nombre: 'Colita Qbana Pilón',            imagen: 'imagenes/aliados/colita-qbana-pilon.webp' },
  { nombre: '2 Grados · sal, fruta y helados', imagen: 'imagenes/aliados/2-grados.webp' },
  { nombre: 'Asados Chimi Paisa',            imagen: 'imagenes/aliados/asados-chimi-paisa.webp' },
];

const SELLOS = [
  { icono: 'catalogo', titulo: 'Portafolio amplio',    texto: 'Más de 15 categorías en un solo lugar.' },
  { icono: 'mayor',    titulo: '+20 años de experiencia', texto: 'Somos su aliado.' },
  { icono: 'moto',     titulo: 'Servicio a domicilio', texto: 'Su pedido, directo a su negocio.' },
  { icono: 'whatsapp', titulo: 'Pedido por WhatsApp',  texto: 'Envíenos la lista y reciba su cotización.' },
];

/*
 * Medios de pago. «detalle» es la línea destacada de cada tarjeta y «copiar»
 * marca la que lleva botón para copiarla —el número de cuenta, que nadie
 * quiere transcribir a mano desde el celular.
 */
const PAGOS = [
  { icono: 'efectivo', titulo: 'Efectivo',
    texto: 'En el punto y contra entrega.' },
  { icono: 'banco', titulo: 'Transferencia',
    // El QR es de Bre-B, así que la llave va primero: es lo que el código
    // lleva dentro y lo que pide la app si no se puede escanear. La cuenta
    // queda debajo para quien prefiera la transferencia de siempre.
    qr: 'imagenes/qr-bancolombia.webp',
    datos: [
      { etiqueta: 'Llave Bre-B', valor: '0092344673', copiar: '0092344673' },
      // Se muestra agrupada como la escribe el banco y se copia sin guiones
      { etiqueta: 'Cuenta de ahorros', valor: '741-878653-05', copiar: '74187865305' },
    ],
    texto: 'Bancolombia · Edwin Zuluaga Vásquez' },
  { icono: 'pago', titulo: 'Datáfono',
    texto: 'Se reciben todas las tarjetas.' },
];

/* A quién le surtimos, en la sección de servicio a domicilio */
const SURTIMOS = [
  { icono: 'domo',        titulo: 'Restaurantes y comidas rápidas',
    texto: 'Carnes frías, congelados, salsas, aceites y el desechable para el domicilio.' },
  { icono: 'reposteria',  titulo: 'Panadería y repostería',
    texto: 'Harinas, margarinas, azúcar, huevos, esencias y domos para torta.' },
  { icono: 'carrito',     titulo: 'Tiendas y mercados',
    texto: 'Quesos y lácteos con la rotación de su punto, en las presentaciones que se venden.' },
  { icono: 'institucion', titulo: 'Volumen institucional',
    texto: 'Aceites de 19 L, salsas de 4.000, hielo, bebidas y desechables.' },
];

/* Los pasos de «¿Cómo pedir?», en la sección de contacto */
const PASOS = [
  { titulo: 'Elige',              texto: 'Explore nuestras categorías y seleccione los productos que necesita.' },
  { titulo: 'Arma tu lista',      texto: 'Agregue todos los productos que quiere pedir.' },
  { titulo: 'Envíanos tu pedido', texto: 'Mándenos su lista por WhatsApp.' },
  { titulo: 'Confirmamos',        texto: 'Le enviamos precios, disponibilidad y el total de su pedido.' },
  { titulo: 'Recibe tu pedido',   texto: 'Coordinamos el despacho hasta donde lo necesite.' },
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
    presentacion: '250 g · 500 g', imagen: 'imagenes/productos/queso-campesino.webp', destacado: true,
  },
  {
    id: 'queso-cuajada', nombre: 'Queso cuajada', categoria: 'quesos',
    descripcion: 'Cuajada fresca, para acompañar con melao o bocadillo.',
    presentacion: '250 g · 500 g', imagen: 'imagenes/productos/queso-cuajada.webp', destacado: true,
  },
  {
    id: 'queso-mozzarella', nombre: 'Queso mozzarella', categoria: 'quesos',
    descripcion: 'El que estira en la pizza, la lasaña y el sánduche caliente.',
    presentacion: '250 g · 500 g · 2.500 g', imagen: 'imagenes/productos/queso-mozarella.webp', destacado: true,
  },
  {
    id: 'queso-costeno', nombre: 'Queso costeño', categoria: 'quesos',
    descripcion: 'Salado y firme, para rallar sobre el sancocho o el arroz.',
    presentacion: '125 g · 250 g · 500 g · 1.000 g', imagen: 'imagenes/productos/queso-costeno.webp', destacado: false,
  },
  {
    id: 'queso-cheddar', nombre: 'Queso cheddar', categoria: 'quesos',
    descripcion: 'En lonjas, para hamburguesas y sánduches.',
    presentacion: '400 g', imagen: 'imagenes/productos/queso-cheddar.webp', destacado: false,
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
    presentacion: '500 g · 5 porciones', imagen: 'imagenes/productos/carne-hamburguesa.webp', destacado: true,
  },
  {
    id: 'salchicha-perro', nombre: 'Salchicha americana', categoria: 'carnes',
    marca: 'Zenú',
    descripcion: 'Salchicha súper perro tipo americana para su negocio.',
    presentacion: '22 unidades', imagen: 'imagenes/productos/salchicha-perro.webp', destacado: false,
  },
  {
    id: 'jamon', nombre: 'Jamón', categoria: 'carnes',
    marca: 'Rica Chef',
    descripcion: 'Tajado parejo, perfecto para la pizza.',
    presentacion: '500 g · 30 tajadas', imagen: 'imagenes/productos/jamon.webp', destacado: false,
  },
  {
    id: 'tocineta', nombre: 'Tocineta', categoria: 'carnes',
    marca: 'Titos',
    descripcion: 'De cerdo ahumada, en lonjas parejas.',
    presentacion: '250 g · 500 g · 1.000 g', imagen: 'imagenes/productos/tocineta.webp', destacado: false,
  },
  {
    id: 'chorizos', nombre: 'Chorizos', categoria: 'carnes',
    marca: 'El Paisa',
    descripcion: 'Chorizo santarrosano, para asar o freír.',
    presentacion: '5 porciones', imagen: 'imagenes/productos/chorizo-santarosano.webp', destacado: true,
  },
  {
    id: 'salchichones', nombre: 'Salchichones', categoria: 'carnes',
    marca: 'Calinnas',
    descripcion: 'Cervecero ahumado de cerdo.',
    presentacion: '1.000 g', imagen: 'imagenes/productos/salchichon-calimas.webp', destacado: false,
  },
  {
    id: 'manguera', nombre: 'Manguera', categoria: 'carnes',
    descripcion: 'Salchicha larga para la salchipapa.',
    presentacion: '250 g · 500 g · 1.000 g', imagen: 'imagenes/productos/salchicha-manguera.webp', destacado: false,
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
    presentacion: '500 g · 1.000 g', imagen: 'imagenes/productos/maiz-dulce.webp', destacado: false,
  },
  {
    id: 'mix-verduras', nombre: 'Mix de verduras', categoria: 'congelados',
    marca: 'Ricongelisto',
    descripcion: 'Arveja, zanahoria, maíz y habichuela, ya picados.',
    presentacion: '500 g', imagen: 'imagenes/productos/mix-de-verduras.webp', destacado: false,
  },
  {
    id: 'croquetas-yuca', nombre: 'Croquetas de yuca', categoria: 'congelados',
    marca: 'Ricongelisto',
    descripcion: 'Congeladas, para freír al momento.',
    presentacion: '500 g · 1.000 g', imagen: 'imagenes/productos/croquetas-de-yuca.webp', destacado: false,
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
    descripcion: 'Plato pando de icopor para eventos.',
    presentacion: '23 cm · 20 unidades', imagen: 'imagenes/productos/plato-de-icopor.webp', destacado: false,
  },
  {
    id: 'vasos-desechables', nombre: 'Vasos desechables', categoria: 'desechables',
    marca: 'Wau!',
    descripcion: 'Vaso translúcido reciclable, para bebidas frías.',
    presentacion: '7 oz · 50 unidades', imagen: 'imagenes/productos/vaso-plastico.webp', destacado: false,
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
    id: 'copas-salseras', nombre: 'Copa salsera con tapa', categoria: 'desechables',
    descripcion: 'Para salsas y aderezos.',
    presentacion: '½ oz · 1 oz · 2 oz', imagen: 'imagenes/productos/copa-salsera.webp', destacado: false,
  },
  {
    id: 'papel-aluminio', nombre: 'Papel aluminio', categoria: 'desechables',
    marca: 'House',
    descripcion: 'Rollo para horno, asado y para conservar.',
    presentacion: '6 m · 16 m · 40 m · 100 m · 300 m', imagen: 'imagenes/productos/papel-aluminio.webp', destacado: false,
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
    id: 'salsas-difier', nombre: 'Salsas Differ', categoria: 'salsas',
    marca: 'Differ',
    descripcion: 'Mayonesa con ajo, tomate sabor Bar-BQ y fruta con piña, entre otros sabores.',
    presentacion: '500 g · 1.000 g · 4.000 g', imagen: 'imagenes/productos/salsas-differ.webp', destacado: false,
  },
  {
    id: 'pompeya-pina', nombre: 'Pompeya de piña', categoria: 'salsas',
    marca: 'Pompeya',
    descripcion: 'Para repostería y para acompañar carnes.',
    presentacion: '4.000 g', imagen: 'imagenes/productos/salsa-pompeya.webp', destacado: false,
  },
  {
    id: 'salsa-italiana', nombre: 'Salsa italiana', categoria: 'salsas',
    marca: 'Italiano',
    descripcion: 'Salsita con tomate, para pastas, lasañas y pizzas.',
    presentacion: '4.000 g', imagen: 'imagenes/productos/salsa-italiana.webp', destacado: false,
  },
  {
    id: 'salsa-bbq', nombre: 'Salsa BBQ', categoria: 'salsas',
    marca: 'Zafrán',
    descripcion: 'BBQ dulce, en bolsa con asa para el restaurante.',
    presentacion: '4,3 kg · 287 porciones', imagen: 'imagenes/productos/salsa-bbq-maleta.webp', destacado: false,
  },

  /* ---------------- Panadería y repostería ---------------- */
  {
    id: 'huevos', nombre: 'Huevos', categoria: 'reposteria',
    descripcion: 'AA y AAA.',
    presentacion: 'Por unidad, medio panal o panal de 30', imagen: 'imagenes/productos/huevos-aa-aaa.webp', destacado: true,
  },
  {
    id: 'harinas', nombre: 'Harina de trigo', categoria: 'reposteria',
    marca: 'Haz de Oros',
    descripcion: 'Fortificada tradicional, para panadería y amasijos.',
    presentacion: 'Bulto de 50 kg y por arroba', imagen: 'imagenes/productos/harina-de-trigo.webp', destacado: false,
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
    presentacion: '60 ml · 500 ml', imagen: 'imagenes/productos/esencias-para-alimentos.webp', destacado: false,
  },

  /* ---------------- Panes ---------------- */
  {
    id: 'pan-hamburguesa', nombre: 'Pan para hamburguesa', categoria: 'panes',
    marca: 'Pan del Valle',
    descripcion: 'Tipo brioche, del tamaño que maneja la comida rápida.',
    presentacion: '10 unidades', imagen: 'imagenes/productos/pan-hamburguesa.webp', destacado: false,
  },
  {
    id: 'pan-perro', nombre: 'Pan para perro', categoria: 'panes',
    marca: 'Bimbo',
    descripcion: 'Suave y esponjoso, con ajonjolí.',
    presentacion: '10 unidades', imagen: 'imagenes/productos/pan-perro.webp', destacado: false,
  },
  {
    id: 'pan-tajado', nombre: 'Pan tajado', categoria: 'panes',
    marca: 'Pan Pullman',
    descripcion: 'Para sánduches y desayunos.',
    presentacion: '660 g · 28 porciones', imagen: 'imagenes/productos/pan-tajado.webp', destacado: false,
  },
  {
    id: 'pan-colita', nombre: 'Pan colita', categoria: 'panes',
    marca: 'Pan Catalina',
    descripcion: 'El clásico para colitas cubanas.',
    presentacion: '10 unidades', imagen: 'imagenes/productos/pan-colita-catalina.webp', destacado: false,
  },

  /* ---------------- Aceites ---------------- */
  {
    id: 'aceite-industrial', nombre: 'Aceite industrial', categoria: 'aceites',
    marca: 'Celestial',
    descripcion: 'Aceite industrial para altas temperaturas.',
    presentacion: '19 litros', imagen: 'imagenes/productos/aceite-industrial-19lts.webp', destacado: true,
  },
  {
    id: 'aceite-galon', nombre: 'Aceite de palma', categoria: 'aceites',
    marca: 'Palma de Oro',
    descripcion: 'Perfecto para freír.',
    presentacion: '900 ml · 3.000 ml · 5.000 ml', imagen: 'imagenes/productos/aceite-de-palma-5000ml.webp', destacado: false,
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
    marca: 'Productos Libertad',
    descripcion: 'Azafrán color extra, para condimentar sus preparaciones.',
    presentacion: '250 g · 500 g · 1.000 g', imagen: 'imagenes/productos/color-sazonador.webp', destacado: false,
  },
  {
    id: 'acento', nombre: 'Acento', categoria: 'condimentos',
    marca: 'La Granja Paisa',
    descripcion: 'Sazonador de uso diario en cocina.',
    presentacion: '250 g · 500 g', imagen: 'imagenes/productos/acento-sazonador.webp', destacado: false,
  },
  {
    id: 'comino', nombre: 'Comino', categoria: 'condimentos',
    marca: 'Productos Libertad',
    descripcion: 'Molido, para carnes y sopas.',
    presentacion: '25 g', imagen: 'imagenes/productos/comino-molido.webp', destacado: false,
  },

  /* ---------------- Lácteos ---------------- */
  {
    id: 'leche', nombre: 'Leche', categoria: 'lacteos',
    marca: 'Alquería',
    descripcion: 'Entera, deslactosada y descremada, por bolsa y por paca.',
    presentacion: '1.100 ml', imagen: 'imagenes/productos/leche-entera.webp', destacado: false,
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
    descripcion: 'Sabores surtidos: fresa, mora, coco, melocotón, kiwi, frutos rojos y natural.',
    presentacion: '1.750 g', imagen: 'imagenes/productos/yogurt.webp', destacado: false,
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
