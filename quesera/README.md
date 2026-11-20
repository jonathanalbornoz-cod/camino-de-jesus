# Quesera Chiminangos — sitio web

Catálogo digital de la salsamentaria **Quesera Chiminangos** (Cali, Colombia).
Sin precios: el pedido y la cotización se hacen por WhatsApp, como pide el brief.

Sitio estático, sin build ni dependencias: se abre `index.html` y funciona.

```
index.html              la página (no hay que tocarla para cambiar contenido)
legal.html              política de datos y términos comerciales, enlazada desde el pie
estilos.css             paleta y estilos
app.js                  filtros, pedido y enlaces de WhatsApp
datos.js                TODO el contenido editable
imagenes/logo.*         el logotipo
imagenes/equipo.webp    la foto del equipo, en la sección Nosotros
imagenes/qr-bancolombia.webp   el QR de pago, en medios de pago
imagenes/portada-estanteria.webp   la góndola de la portada
imagenes/domicilio.webp la foto del domiciliario, en servicio a domicilio
imagenes/productos/     las fotos de producto, tal como vienen del set
imagenes/aliados/       los logos de «Nuestros clientes»
```

## De dónde salen los datos

- **Brief** de Injoe Agencia (`BRIEF WEB SITE INJOE AGENCIA 2.docx`): nombre, contacto,
  WhatsApp, ciudad, estilo y funcionalidades pedidas.
- **`Categorias productos Quesera Chiminangos.pdf`**: las 10 categorías y los 50 productos.
- **Las fotos de producto**: las marcas y los gramajes están impresos en cada empaque,
  de ahí salen (Zenú 500 g, Rica Chef 30 tajadas, Wau! 7 oz × 50, etc.).
- **`TEXTOS_CATALOGO.docx`**: la primera ronda de textos del cliente, con lo que quería
  cambiar marcado en verde. De ahí vienen el titular enfocado al negocio, los cuatro
  sellos, el texto de Nosotros, los pasos de «¿Cómo pedir?», el horario y los medios de
  pago.
- **`MODIFICACIONES_FINALES.docx`**: la segunda ronda. La góndola en la portada, la barra
  de filtros quieta, la distribución de servicio a domicilio —que venía dibujada en el
  propio documento—, las redes sociales y 31 correcciones de presentaciones y
  descripciones.

Dos cosas que vienen de esos documentos y conviene contrastar con el cliente:

- El sello dice «Más de 15 categorías en un solo lugar», pero el catálogo tiene 11. Es el
  texto que pidió; si quiere que cuadre, hay que cambiar uno de los dos.
- La dirección cambió dos veces. La que está puesta es la del último documento:
  Calle 62B #1A9-250, barrio Chiminangos II. El mapa apunta ahí.
- Los datos de pago están en `PAGOS`, en `datos.js`. El QR es de **Bre-B**, recortado de
  la pieza «Paga aquí» que mandó el cliente, así que la llave va primero: es lo que el
  código lleva dentro. Debajo queda la cuenta de ahorros para la transferencia de
  siempre. Cada número se muestra como lo escribe el banco y su botón copia los dígitos
  en limpio, que es como los pide la app.

## Lo que falta confirmar con el cliente

| Dato | Dónde se pone | Estado |
|---|---|---|
| Precio de 20 productos | `precio` en `PRODUCTOS` | Falta |
| A qué presentación va cada precio | `presentacion` en `PRODUCTOS` | Por confirmar |
| Presentación de 2 productos | `presentacion` en `PRODUCTOS` | Falta |
| Marca de 9 productos | `marca` en `PRODUCTOS` | Falta |
| Qué más se vende a granel | `cotizacion` en `PRODUCTOS` | Por revisar |
| Razón social y NIT | `razonSocial` y `nit` en `MARCA` | Puestos |
| Revisión del texto legal | `legal.html` | Por revisar |

Los 54 productos tienen foto y 52 tienen presentación. Faltan la de la **costilla
ahumada** y la de los **domos para torta**: ni el cliente las dio ni el empaque de la
foto las dice. Mientras tanto la tarjeta no se queda muda, dice «Presentación ·
consúltela por WhatsApp», que es la verdad y no un hueco.

Nueve productos no tienen marca porque son genéricos o se venden a granel: maíz dulce,
salchicha manguera, contenedores, portacomidas, moldes de aluminio, copas salseras,
huevos, domos para torta y esencias. Si el cliente trabaja una marca fija de alguno, se
agrega y aparece sola sobre la foto.

`cotizacion: true` está puesto en lo que se corta y se pesa en el mostrador: los cinco
quesos y la costilla ahumada. Vale la pena que el cliente confirme si hay más (jamones,
salchichón, huevos) y se agregan igual.

Los bloques que dependen de un dato ausente no se dibujan vacíos: simplemente no salen.
Lo que falte se avisa por la consola del navegador, no en pantalla.

## Cómo completar cada cosa

**Mapa** — `MARCA.mapaEmbed` lleva el embed oficial de la ficha del negocio
(`/maps/embed?pb=...`, place id `0x8e30a7513b8e757d:0x17a64a51b76f1f04`). Es el único
formato en el que el puntero sale rotulado «QUESERA CHIMINAGOS»: con `?q=lat,lng` el
globo muestra las coordenadas y con la dirección en texto el puntero se corre unos 60
metros al oriente, porque Google geocodifica «Calle 62B #1A9-250» en la cuadra de al
lado. Para rehacerlo: Google Maps → buscar el negocio → *Compartir* → *Insertar un
mapa* → copiar sólo la URL del `src` del iframe y pegarla ahí. El `width`, el `height`
y los demás atributos no se copian: los pone `app.js` y el tamaño sale de
`.mapa iframe` en `estilos.css`. La sección aparece sola.

**Precios** — el brief los dejaba fuera y el cliente decidió después publicarlos. Están
cargados **34 de los 54**, con la lista que mandó el cliente el 20 de noviembre de 2026;
los otros 20 dicen «Consultar cotización vigente» hasta que lleguen. Se agregan dos campos
al producto en `datos.js`:

```js
{ id: 'queso-campesino', …, precio: 18900, unidad: 'kg' },   // se pesa → por kilo
{ id: 'jamon',           …, precio: 9800 },                  // empacado → sin unidad
```

- `precio` va como número pelado, sin puntos ni comillas: `18900`, no `'$18.900'`. La
  página lo formatea sola como `$18.900`.
- `unidad` es opcional y sólo aclara a qué corresponde la cifra: `kg`, `libra`, `caja`.
  En todo lo que lleve `cotizacion: true` va `'kg'`, que fue lo que pidió el cliente.
- El producto que se deje sin `precio` sigue mostrando «Consultar cotización vigente».
- `preciosActualizados` en `MARCA`: la fecha de la lista. Sale junto a los precios en el
  encabezado del catálogo. **Si se tocan los precios, se toca esa fecha.**

El encabezado del catálogo cambia solo: mientras no haya ni un precio dice que cotizamos
por WhatsApp; apenas entra el primero, pasa a explicar en qué moneda están, que lo de
granel va por kilo y desde cuándo rigen.

**Lo que quedó por confirmar de la lista de precios:**

- **«San Jorge $68.000»** se cargó en el *aderezo de mayonesa* (3.950 g). La *arveja con
  zanahoria* también es San Jorge y quedó sin precio; si los $68.000 eran de ella, se
  cambia.
- **Huevos $17.000** se cargó como panal de 30, que es lo único que cuadra con ese
  precio. La presentación ofrece también unidad y medio panal.
- **Portacomidas $500** se cargó por unidad. Falta saber a cuál referencia corresponde
  (C1, J2, P1 o K1) o si es el mismo para todas.
- **Queso cheddar $13.800** vino sin la palabra «kilo», así que se tomó como el paquete de
  400 g y se le quitó la marca de venta a granel que tenía.
- **Manguera $8.000** vino «por kilo», así que se le puso esa marca: ahora avisa que se
  pesa al momento.
- El cliente escribió **«Salchichón Calima»** y en el catálogo la marca es **Calinnas**.
- **Un precio para varias presentaciones.** Hay productos cuya tarjeta ofrece varios
  tamaños y recibió una sola cifra: tocineta (250/500/1.000 g), maíz dulce, croquetas de
  yuca, contenedores (8 a 24 oz), copa salsera (½ a 2 oz), papel aluminio (6 a 300 m),
  moldes de aluminio («varios tamaños») y salsas Differ (500 a 4.000 g). Tal como está, el
  cliente va a leer que ese precio vale para cualquiera de los tamaños. Hay que pedirle a
  qué presentación corresponde cada cifra y, en los que valga la pena, partirlos en
  productos separados.

Dos cosas para hablar con el cliente antes de publicar la lista:

- **El IVA.** El Estatuto del Consumidor exige mostrarle al consumidor el precio total,
  impuestos incluidos. Hay que confirmar si las cifras que entregue ya lo traen y, si
  aplica, decirlo en la página.
- **El precio publicado obliga.** Mientras esté en la página hay que respetarlo, así que
  conviene actualizarlo apenas cambie; por eso la fecha.

**Página legal** (`legal.html`) — una sola página con tres partes: la política de
tratamiento de datos personales (Ley 1581 de 2012 y Decreto 1074 de 2015), los términos
y condiciones comerciales (Ley 1480 de 2011) y los datos de contacto. Los enlaces salen
en el pie de **todas** las páginas. La dirección, el correo, el teléfono y el horario no
están escritos ahí: los toma de `MARCA` en `datos.js`, para que no queden distintos en
dos archivos. Lo que sí hay que mantener a mano:

- `vigenciaLegal` en `MARCA`: la fecha desde la que rige. **Si se cambia el texto de la
  página, se cambia también esta fecha.**
- `razonSocial` y `nit` en `MARCA`: ya están puestos (Quesera y Salsamentaria
  Chiminangos, NIT 1002596521). En el documento manda la razón social y el nombre de
  siempre queda detrás como nombre comercial. Siguen siendo opcionales: si se vacían, la
  página no se rompe, queda sólo el nombre.
- El texto es un borrador completo y redactado para este negocio, pero **lo tiene que
  leer y adoptar el cliente** antes de darlo por definitivo: es él quien responde por lo
  que ahí se promete (plazos de entrega, garantías, devoluciones).

**Redes** — pegar la URL completa del perfil. Los iconos aparecen solos; los vacíos no salen.

**Nuestros clientes** — la lista `ALIADOS` de `datos.js` (el título de la sección cambió
después de escribir el código; la lista conservó el nombre con que nació). Para sumar una se copia
su logo a `imagenes/aliados/` y se agrega una línea con `nombre` e `imagen`; si tiene sitio
o red social se le pone `url` y el logo se vuelve enlace. Los logos se normalizan antes de
entrar, con `tools/preparar-aliados.py`: recorta el margen del color de fondo, vuelve a
cuadrar con ese mismo color y deja un 7 % de aire, para que los tres pesen igual dentro de
su tarjeta aunque lleguen con fondos y proporciones distintas (dos en blanco, uno en negro).
La sección se esconde sola si la lista queda vacía.

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

## Un apunte para quien edite esto

Casi todo el contenido vive en `datos.js`: marca, redes, sellos, recuadros de
mayoristas, pasos de «¿Cómo pedir?», medios de pago, categorías y productos. Si algo de
la página hay que cambiar, mirar ahí primero; el HTML sólo tiene la estructura.

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
