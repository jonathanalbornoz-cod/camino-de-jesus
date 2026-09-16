/*
 * Quesera Chiminangos — contenido del sitio
 * ------------------------------------------------------------------
 * Todo lo editable vive en este archivo. Para cambiar el catálogo, los
 * datos de contacto o los textos NO hace falta tocar el HTML ni el CSS.
 *
 * Los valores marcados con PENDIENTE están a la espera del brief oficial
 * (el PDF de la marca). Mientras «whatsapp» siga en PENDIENTE, la página
 * muestra un aviso amarillo para que nadie publique el sitio sin número.
 */

const MARCA = {
  nombre: 'Quesera Chiminangos',
  eslogan: 'Salsamentaria artesanal',
  // Frase corta de la portada
  promesa: 'Quesos frescos, lácteos y carnes frías del Valle, hechos como en casa.',
  descripcion:
    'Somos una salsamentaria de barrio: seleccionamos producto fresco todos los días ' +
    'y lo despachamos cortado, empacado y listo para su mesa. Atendemos al detal y ' +
    'por mayor para tiendas, restaurantes y panaderías.',

  // Número en formato internacional, sólo dígitos: 57 + los 10 del celular.
  // Ejemplo de la forma esperada: '573001234567'
  whatsapp: 'PENDIENTE',
  // Cómo se muestra escrito en pantalla, ej. '+57 300 123 4567'
  whatsappVisible: 'PENDIENTE',

  direccion: 'PENDIENTE — dirección del punto de venta',
  ciudad: 'Cali, Valle del Cauca',
  horario: 'Lunes a sábado 7:00 a.m. – 7:00 p.m. · Domingos y festivos 8:00 a.m. – 2:00 p.m.',
  correo: '',
  instagram: '',
  facebook: '',
  // Ruta del logotipo cuando se extraiga del PDF, ej. 'imagenes/logo.png'.
  // Vacío = se dibuja el sello tipográfico de respaldo.
  logo: '',
};

/* Los sellos de la franja bajo la portada */
const SELLOS = [
  { icono: 'queso', titulo: 'Producción fresca', texto: 'Quesos y lácteos que rotan a diario, nunca de bodega.' },
  { icono: 'corte', titulo: 'Como lo necesite', texto: 'Cortamos, tajamos y empacamos al vacío a su medida.' },
  { icono: 'moto', titulo: 'Domicilios', texto: 'Llevamos su pedido en la ciudad el mismo día.' },
  { icono: 'mayor', titulo: 'Al detal y por mayor', texto: 'Precios y presentaciones para negocios.' },
];

/*
 * Categorías del catálogo. El «id» es el que usan los productos.
 * El orden de esta lista es el orden de los filtros.
 */
const CATEGORIAS = [
  { id: 'quesos',    nombre: 'Quesos',              icono: 'queso' },
  { id: 'lacteos',   nombre: 'Lácteos y derivados', icono: 'leche' },
  { id: 'embutidos', nombre: 'Embutidos',           icono: 'embutido' },
  { id: 'carnes',    nombre: 'Carnes frías',        icono: 'carne' },
  { id: 'amasijos',  nombre: 'Amasijos',            icono: 'pan' },
  { id: 'despensa',  nombre: 'Despensa',            icono: 'despensa' },
];

/*
 * Etiquetas transversales: son el segundo filtro, el que cruza categorías.
 */
const ETIQUETAS = [
  { id: 'artesanal', nombre: 'Artesanal' },
  { id: 'vacio',     nombre: 'Empacado al vacío' },
  { id: 'mayor',     nombre: 'Disponible por mayor' },
  { id: 'frio',      nombre: 'Cadena de frío' },
  { id: 'horno',     nombre: 'Del horno' },
];

/*
 * Catálogo PROVISIONAL: surtido típico de salsamentaria, puesto para que la
 * página se pueda ver funcionando. Reemplazar por el listado del brief.
 *
 * Campos de cada producto:
 *   id           único, se usa en el enlace compartible
 *   nombre       como se escribe en el pedido
 *   categoria    id de CATEGORIAS
 *   descripcion  una o dos líneas
 *   presentacion cómo se vende (libra, kilo, unidad, paquete…)
 *   etiquetas    ids de ETIQUETAS
 *   destacado    true lo sube al comienzo y lo marca en la tarjeta
 *   imagen       ruta a la foto, ej. 'imagenes/queso-campesino.jpg'.
 *                Vacío = se dibuja la ilustración de la categoría.
 *
 * NO se incluyen precios: es una decisión del brief, el precio se da por
 * WhatsApp. Si algún día se agregan, va aquí y hay que tocar la tarjeta.
 */
const PRODUCTOS = [
  {
    id: 'queso-campesino',
    nombre: 'Queso campesino',
    categoria: 'quesos',
    descripcion: 'Fresco, de sal suave y textura húmeda. El de todos los días.',
    presentacion: 'Libra, kilo o bloque entero',
    etiquetas: ['artesanal', 'frio', 'mayor'],
    destacado: true,
    imagen: '',
  },
  {
    id: 'queso-doble-crema',
    nombre: 'Queso doble crema',
    categoria: 'quesos',
    descripcion: 'El que se estira en el pandebono y en la arepa asada.',
    presentacion: 'Libra, kilo o bloque entero',
    etiquetas: ['artesanal', 'vacio', 'mayor'],
    destacado: true,
    imagen: '',
  },
  {
    id: 'quesillo',
    nombre: 'Quesillo',
    categoria: 'quesos',
    descripcion: 'Amasado a mano y envuelto en hoja de plátano.',
    presentacion: 'Unidad',
    etiquetas: ['artesanal', 'frio'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'queso-costeno',
    nombre: 'Queso costeño',
    categoria: 'quesos',
    descripcion: 'Salado y firme, para rallar sobre el sancocho o el arroz.',
    presentacion: 'Libra o kilo',
    etiquetas: ['artesanal', 'mayor'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'mozzarella',
    nombre: 'Mozzarella',
    categoria: 'quesos',
    descripcion: 'En bloque o rallada, para pizza y lasaña.',
    presentacion: 'Bloque, o bolsa rallada de 500 g y 1 kg',
    etiquetas: ['vacio', 'mayor', 'frio'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'cuajada',
    nombre: 'Cuajada',
    categoria: 'quesos',
    descripcion: 'Del día, para el desayuno con melao o bocadillo.',
    presentacion: 'Libra',
    etiquetas: ['artesanal', 'frio'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'queso-crema',
    nombre: 'Queso crema',
    categoria: 'quesos',
    descripcion: 'Untable, para tortas frías y pasabocas.',
    presentacion: 'Tarro de 500 g y 1 kg',
    etiquetas: ['frio', 'mayor'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'kumis',
    nombre: 'Kumis',
    categoria: 'lacteos',
    descripcion: 'Espeso y ácido, en botella de vidrio o garrafa.',
    presentacion: 'Botella de 1 L y garrafa de 2 L',
    etiquetas: ['artesanal', 'frio'],
    destacado: true,
    imagen: '',
  },
  {
    id: 'yogurt',
    nombre: 'Yogurt natural y de frutas',
    categoria: 'lacteos',
    descripcion: 'Mora, fresa, melocotón y natural sin endulzar.',
    presentacion: 'Botella de 1 L y garrafa de 2 L',
    etiquetas: ['frio', 'mayor'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'arequipe',
    nombre: 'Arequipe',
    categoria: 'lacteos',
    descripcion: 'Cocido despacio, denso y sin sabor a quemado.',
    presentacion: 'Tarro de 250 g, 500 g y 1 kg',
    etiquetas: ['artesanal', 'mayor'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'mantequilla',
    nombre: 'Mantequilla campesina',
    categoria: 'lacteos',
    descripcion: 'De batido, con sal o sin sal.',
    presentacion: 'Libra',
    etiquetas: ['artesanal', 'frio'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'suero-costeno',
    nombre: 'Suero costeño',
    categoria: 'lacteos',
    descripcion: 'Para la arepa, el patacón y el bollo.',
    presentacion: 'Tarro de 500 g',
    etiquetas: ['artesanal', 'frio'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'leche',
    nombre: 'Leche fresca',
    categoria: 'lacteos',
    descripcion: 'Recibida en la madrugada, se despacha el mismo día.',
    presentacion: 'Bolsa de 1 L',
    etiquetas: ['frio', 'mayor'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'chorizo',
    nombre: 'Chorizo santarrosano',
    categoria: 'embutidos',
    descripcion: 'Amarrado a mano, para asar o freír.',
    presentacion: 'Paquete de 5 y 10 unidades',
    etiquetas: ['artesanal', 'vacio', 'mayor'],
    destacado: true,
    imagen: '',
  },
  {
    id: 'morcilla',
    nombre: 'Morcilla',
    categoria: 'embutidos',
    descripcion: 'Con arroz y hierbas, bien condimentada.',
    presentacion: 'Paquete de 5 y 10 unidades',
    etiquetas: ['artesanal', 'frio'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'salchicha',
    nombre: 'Salchicha',
    categoria: 'embutidos',
    descripcion: 'Tipo ranchera y tipo perro, en paquete sellado.',
    presentacion: 'Paquete de 500 g y 1 kg',
    etiquetas: ['vacio', 'mayor'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'salchichon',
    nombre: 'Salchichón cervecero',
    categoria: 'embutidos',
    descripcion: 'En trozo o tajado al momento.',
    presentacion: 'Trozo o tajado por libra',
    etiquetas: ['vacio', 'mayor'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'jamon',
    nombre: 'Jamón',
    categoria: 'carnes',
    descripcion: 'De cerdo y de pechuga, tajado del grosor que pida.',
    presentacion: 'Tajado por libra',
    etiquetas: ['vacio', 'frio', 'mayor'],
    destacado: true,
    imagen: '',
  },
  {
    id: 'mortadela',
    nombre: 'Mortadela',
    categoria: 'carnes',
    descripcion: 'Con y sin tocino, tajada fina para sánduche.',
    presentacion: 'Tajada por libra',
    etiquetas: ['vacio', 'mayor'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'tocineta',
    nombre: 'Tocineta ahumada',
    categoria: 'carnes',
    descripcion: 'En lonjas parejas, ahumada de verdad.',
    presentacion: 'Paquete de 250 g y 500 g',
    etiquetas: ['vacio', 'frio'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'chicharron',
    nombre: 'Chicharrón carnudo',
    categoria: 'carnes',
    descripcion: 'Listo para freír, con buena proporción de carne.',
    presentacion: 'Libra',
    etiquetas: ['frio'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'pandebono',
    nombre: 'Pandebono',
    categoria: 'amasijos',
    descripcion: 'Crudo congelado para hornear en casa, o recién horneado.',
    presentacion: 'Bolsa de 10 y 20 unidades',
    etiquetas: ['horno', 'artesanal', 'mayor'],
    destacado: true,
    imagen: '',
  },
  {
    id: 'pan-de-yuca',
    nombre: 'Pan de yuca',
    categoria: 'amasijos',
    descripcion: 'Crocante por fuera, con buen queso adentro.',
    presentacion: 'Bolsa de 10 y 20 unidades',
    etiquetas: ['horno', 'artesanal'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'almojabana',
    nombre: 'Almojábana',
    categoria: 'amasijos',
    descripcion: 'Suave y esponjada, para el café de la tarde.',
    presentacion: 'Bolsa de 6 y 12 unidades',
    etiquetas: ['horno', 'artesanal'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'bunuelo',
    nombre: 'Mezcla de buñuelo',
    categoria: 'amasijos',
    descripcion: 'Con el queso ya incorporado: sólo amasar y freír.',
    presentacion: 'Bolsa de 500 g y 1 kg',
    etiquetas: ['artesanal', 'mayor'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'huevos',
    nombre: 'Huevos',
    categoria: 'despensa',
    descripcion: 'AA y extra, por unidad, media panal o panal.',
    presentacion: 'Panal de 30 unidades',
    etiquetas: ['mayor'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'bocadillo',
    nombre: 'Bocadillo veleño',
    categoria: 'despensa',
    descripcion: 'El compañero obligado de la cuajada y el queso.',
    presentacion: 'Caja y unidad',
    etiquetas: ['mayor'],
    destacado: false,
    imagen: '',
  },
  {
    id: 'panela',
    nombre: 'Panela',
    categoria: 'despensa',
    descripcion: 'Redonda y pulverizada.',
    presentacion: 'Unidad y bolsa de 1 kg',
    etiquetas: ['mayor'],
    destacado: false,
    imagen: '',
  },
];
