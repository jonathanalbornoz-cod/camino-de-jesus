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
imagenes/productos/     las fotos de producto, ya sin la onda del set
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
| Presentaciones | `presentacion` de 29 productos | **Falta** |
| Fotos | 21 de 50 productos | Parcial |

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
pregunta por WhatsApp. Faltan sobre todo los quesos (¿libra, kilo, bloque?), las salsas,
la panadería, los panes, los condimentos y los lácteos.

**Fotos nuevas** — van en `imagenes/productos/`, y la ruta se pone en el campo `imagen`.

Las fotos del set vienen con una onda dorada de fondo. En la web no se usa, así que antes
de montarlas hay que quitarla:

```bash
python3 tools/quitar-onda.py carpeta-con-las-fotos carpeta-limpia
```

Deja el fondo con un horizonte recto y no toca el producto ni su sombra. Si llega una foto
donde el producto es del color de la onda —le pasa al cheddar—, se le añade una entrada al
diccionario `AJUSTES` del propio script, que documenta los casos ya resueltos.

Después se recortan a 3:4 y se pasan a `.webp`, que las deja por debajo de 150 KB. El
recorte va desplazado hacia arriba (0.62) porque el producto vive en la mitad baja del
encuadre:

```python
from PIL import Image
im = Image.open("foto-limpia.png").convert("RGB")
w, h = im.size
alto = int(w / 0.75)
if alto < h:
    arriba = int((h - alto) * 0.62)
    im = im.crop((0, arriba, w, arriba + alto))
im.thumbnail((900, 1200), Image.LANCZOS)
im.save("quesera/imagenes/productos/nombre.webp", "WEBP", quality=82, method=6)
```

Los productos sin foto no quedan feos: muestran el icono de su categoría sobre un fondo
crema, en el mismo formato 3:4 de las fotos.

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

La paleta sale del logotipo y de las fotos: vino `#45181F`, dorado `#F5B921` y crema. El
dorado quedó para acentos —el botón de mayoristas, los antetítulos—; la onda dorada que
traían las fotografías se quitó a petición del cliente, y los cortes entre secciones son
rectos.

De los referentes del brief: de **Cassini** el minimalismo, la fotografía limpia y los
textos cortos; de **Bonanza** la organización por categorías con contadores y el aire de
mayorista (la sección de negocios y las presentaciones institucionales).
