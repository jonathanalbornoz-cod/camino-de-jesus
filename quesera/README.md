# Quesera Chiminangos — sitio web

Catálogo digital de la salsamentaria **Quesera Chiminangos** (Cali, Colombia).
Sin precios: el pedido y la cotización se hacen por WhatsApp, como pide el brief.

Sitio estático, sin build ni dependencias: se abre `index.html` y funciona.

```
index.html              la página (no hay que tocarla para cambiar contenido)
estilos.css             paleta y estilos
app.js                  filtros, pedido y enlaces de WhatsApp
datos.js                TODO el contenido editable
imagenes/logo.*         el logotipo
imagenes/productos/     las fotos de producto, tal como vienen del set
```

## De dónde salen los datos

- **Brief** de Injoe Agencia (`BRIEF WEB SITE INJOE AGENCIA 2.docx`): nombre, contacto,
  WhatsApp, ciudad, estilo y funcionalidades pedidas.
- **`Categorias productos Quesera Chiminangos.pdf`**: las 10 categorías y los 50 productos.
- **Las fotos de producto**: las marcas y los gramajes están impresos en cada empaque,
  de ahí salen (Zenú 500 g, Rica Chef 30 tajadas, Wau! 7 oz × 50, etc.).

## Lo que falta confirmar con el cliente

| Dato | Dónde se pone | Estado |
|---|---|---|
| Dirección del punto | `MARCA.direccion` | **Falta** |
| Horarios de atención | `MARCA.horario` | **Falta** |
| Mapa de ubicación | `MARCA.mapaEmbed` | **Falta** |
| Redes sociales | `MARCA.instagram`, `.facebook`, `.tiktok` | **Falta** |
| Presentaciones | `presentacion` de 15 productos | **Falta** |
| Fotos | 45 de 54 productos | Parcial |

Mientras algo de eso falte, la página muestra una franja arriba diciendo qué es. El aviso
**desaparece solo** cuando estén los cuatro datos de marca. Los bloques que dependen de un
dato ausente (dirección, horarios, mapa, redes) no se dibujan vacíos: simplemente no salen.

## Cómo completar cada cosa

**Dirección y horarios** — en `datos.js`, reemplazar el texto que empieza por `PENDIENTE`.

**Mapa** — Google Maps → buscar el negocio → *Compartir* → *Insertar un mapa* → copiar sólo
la URL del `src` y pegarla en `MARCA.mapaEmbed`. La sección aparece sola.

**Redes** — pegar la URL completa del perfil. Los iconos aparecen solos; los vacíos no salen.

**Presentaciones** — el campo `presentacion` de cada producto. Si está vacío la tarjeta no
muestra esa línea, así que no se ve rota, pero conviene llenarlas: es lo que el cliente
pregunta por WhatsApp. Faltan sobre todo los quesos (¿libra, kilo, bloque?), las salsas sin
foto, los condimentos, el chorizo, la manguera y las copas salseras.

**Fotos nuevas** — se dejan en una carpeta y se preparan de una vez:

```bash
python3 tools/preparar-fotos.py carpeta-con-los-originales
```

Recorta a 3:4, deja el ancho nativo del set y guarda en WebP dentro de
`imagenes/productos/`. Después se pone la ruta en el campo `imagen` del producto.

Las fotos **no se editan**: la onda dorada del fondo se conserva, que es como está
tomado el set y como la quiere el cliente. La página la repite en la portada y en las
tarjetas sin foto, y así el conjunto se lee como una sola pieza.

Sobre la calidad: hubo una versión anterior a 900 px con calidad 82 y se veían
empastadas —40 KB para una imagen de un megapíxel, con la textura del queso deshecha—.
Ahora van al ancho nativo (1024 px tras el recorte) con calidad 90, unos 150 KB cada
una. En una pantalla retina la tarjeta pide unos 750 px y la portada unos 1080, así que
1024 cubre bien. No conviene bajar de ahí.

`tools/quitar-onda.py` quita esa onda del fondo y deja un horizonte recto. Se usó en una
versión anterior y se conserva por si vuelve a hacer falta, pero **hoy no se aplica**.

Los productos sin foto muestran el icono de su categoría sobre la onda, en el mismo
formato 3:4 de las fotos.

## Cómo agregar o cambiar productos

Cada producto es un objeto en `PRODUCTOS`, dentro de `datos.js`:

```js
{
  id: 'tocineta',              // único, sin tildes ni espacios
  nombre: 'Tocineta',          // así va en el mensaje de WhatsApp
  categoria: 'carnes',         // un id de CATEGORIAS
  marca: 'Titos',              // opcional: sale como sello sobre la foto
  presentacion: '900 g',       // opcional
  descripcion: 'De cerdo ahumada, en lonjas parejas.',
  imagen: 'imagenes/productos/tocineta.webp',
  destacado: false,            // true lo sube al comienzo con la insignia
}
```

Las categorías se editan en `CATEGORIAS`: los filtros y sus contadores se dibujan solos.

## Los filtros

- **Categoría** — chips con el número de productos de cada una; se pueden marcar varias.
- **Búsqueda** — por nombre, descripción, presentación, marca y categoría. Ignora las
  tildes, así que «jamon» encuentra «jamón» y «zen» encuentra los productos Zenú.

Los resultados van ordenados por relevancia: primero los que empiezan por lo buscado,
luego los que lo contienen en el nombre, después por marca y por categoría. Sin eso
mandaba el orden del catálogo y buscar «pan» devolvía primero un queso, porque su
descripción dice «acompañar».

## El pedido

En vez de un carrito con precios, el cliente marca productos con **Agregar** y la barra
inferior arma un solo mensaje de WhatsApp con toda la lista y sus presentaciones. Se guarda
en el navegador (`localStorage`), así que sobrevive si recarga o vuelve más tarde. Cada
tarjeta tiene además **Pedir**, que escribe sólo por ese producto.

## Dónde se puede servir

- **GitHub Pages**: tal cual, en `/quesera/`. Todas las rutas son relativas.
- **Cualquier hosting**: subir el contenido de esta carpeta.
- **Local**: `python3 -m http.server` desde la raíz y abrir `http://localhost:8000/quesera/`.

## Decisiones de diseño

La paleta sale del logotipo y de las fotos: vino `#45181F`, dorado `#F5B921` y crema. La
onda dorada del set fotográfico se repite en la portada y en las tarjetas sin foto: es lo
que amarra la página con la fotografía.

De los referentes del brief: de **Cassini** el minimalismo, la fotografía limpia y los
textos cortos; de **Bonanza** la organización por categorías con contadores y el aire de
mayorista (la sección de negocios y las presentaciones institucionales).
