# Quesera Chiminangos — sitio web

Página de la salsamentaria **Quesera Chiminangos**. Sin precios: los pedidos y las
cotizaciones se hacen por WhatsApp, que es lo que pide el brief.

Es un sitio estático, sin build ni dependencias: se abre `index.html` y funciona.

```
index.html     la estructura de la página (no hace falta tocarla para cambiar contenido)
estilos.css    los estilos y la paleta
app.js         filtros del catálogo, armado del pedido y enlaces de WhatsApp
datos.js       TODO el contenido editable: marca, contacto, categorías y productos
imagenes/      logotipo, fotos de producto y favicon
```

## Lo que falta del brief

El PDF de la marca no llegó a la sesión donde se armó el sitio, así que los datos
propios de la empresa están marcados `PENDIENTE` en `datos.js`:

| Dato | Dónde | Estado |
|---|---|---|
| Número de WhatsApp | `MARCA.whatsapp` y `MARCA.whatsappVisible` | **PENDIENTE** |
| Dirección del punto | `MARCA.direccion` | **PENDIENTE** |
| Logotipo | `MARCA.logo` + archivo en `imagenes/` | **PENDIENTE** |
| Catálogo | `PRODUCTOS` | Provisional: surtido típico de salsamentaria |
| Textos de marca | `MARCA.promesa`, `MARCA.descripcion` | Provisionales |

Mientras `MARCA.whatsapp` siga en `PENDIENTE`, la página muestra una franja amarilla
de aviso y los botones de WhatsApp explican que falta configurarlo. El aviso
desaparece solo al poner un número válido, así que el sitio no se puede publicar
por descuido sin él.

## Cómo poner el número de WhatsApp

En `datos.js`, sólo dígitos, con el indicativo del país y sin espacios ni signos:

```js
whatsapp: '573001234567',          // 57 + los 10 del celular
whatsappVisible: '+57 300 123 4567',
```

## Cómo agregar o cambiar productos

Cada producto es un objeto dentro de `PRODUCTOS`, en `datos.js`:

```js
{
  id: 'queso-campesino',        // único, sin espacios ni tildes
  nombre: 'Queso campesino',    // así aparece en el mensaje de WhatsApp
  categoria: 'quesos',          // un id de CATEGORIAS
  descripcion: 'Fresco, de sal suave y textura húmeda.',
  presentacion: 'Libra, kilo o bloque entero',
  etiquetas: ['artesanal', 'frio'],   // ids de ETIQUETAS
  destacado: true,              // lo sube al comienzo y le pone la insignia
  imagen: 'imagenes/queso-campesino.jpg',   // vacío = ilustración de la categoría
}
```

Las categorías y las etiquetas también se editan ahí: los filtros se dibujan solos a
partir de esas dos listas, no hay que tocar el HTML.

**Las fotos** van en `imagenes/`. Conviene recortarlas cuadradas o en 4:3 y dejarlas
por debajo de 300 KB; la tarjeta las recorta a 4:3.

## Los filtros

Tres, y se combinan entre sí:

- **Categoría** — varias a la vez; suma (queso *o* lácteo).
- **Características** — varias a la vez; resta (tiene que cumplirlas todas).
- **Búsqueda** — por nombre, descripción, presentación y categoría; ignora las tildes,
  así que «jamon» encuentra «jamón».

## El pedido

En vez de un carrito con precios, el cliente marca productos con **Agregar** y la barra
inferior arma un solo mensaje de WhatsApp con la lista. El pedido se guarda en el
navegador (`localStorage`), así que sobrevive si la persona recarga o vuelve más tarde.
Cada tarjeta tiene además un botón **Pedir** que escribe sólo por ese producto.

## Dónde se puede servir

- **GitHub Pages**: tal cual, en `/quesera/`. Todas las rutas son relativas.
- **Cualquier hosting**: subir el contenido de esta carpeta.
- **Local**: `python3 -m http.server` desde la raíz del repositorio y abrir
  `http://localhost:8000/quesera/`.

## Referentes

Los dos que pidió el cliente:

1. **La Quesera Cassini & Cerato** — de ahí sale el tono artesanal: fondo crema,
   titulares en serif, foto grande de producto y fichas sobrias.
2. **Bonanza Grupo Empresarial** — de ahí sale la estructura comercial: bloques de
   servicios, franja de sellos y una sección de contacto clara.
