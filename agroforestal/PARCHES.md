# Parches sobre la aplicación compilada

Respuesta a `OBSERVACIONES_A_LA_PAGINA_WEB.pdf`. Se anota aquí porque la aplicación es
un build de producción: si algún día se recompila desde el proyecto Angular original,
estos cambios se pierden y hay que rehacerlos **en el código fuente**, que es su sitio.

Tres de las cinco observaciones se resolvieron sin tocar el bundle. Sólo la primera
necesitó editarlo.

---

## 1. «Nuestra vitrina: solo aparecen 6 categorías»

**Archivo:** `chunk-G5XOI3AW.js` (componente de la portada)

Había dos topes encadenados, no uno:

```js
// antes
getCategories().subscribe(o => { let n = o.slice(0, 8);
    …n.map(…).filter(x => x.count > 0).slice(0, 6);

// después
getCategories().subscribe(o => { let n = o;
    …n.map(…).filter(x => x.count > 0);
```

El de 8 recortaba la lista **antes** de contar los productos de cada categoría, así que
quitar sólo el de 6 dejaba ocho pestañas. Con los dos fuera aparecen las 29.

El contenedor ya era `flex flex-wrap`, así que las pestañas se reparten en varias
líneas sin tocar el diseño. Cada categoría dispara una consulta para contar sus
productos —29 en vez de 8—, pero las responde `offline-api.js` desde memoria.

Se conserva un tercer `slice(0, 6)` en el mismo archivo: es la rejilla de seis
destacados de «Lo más buscado del campo», que no forma parte de la observación.

---

## 2. «Categorías y marcas no aparecen en orden alfabético»

**Sin parche.** Se resolvió al hornear los datos: `tools/hornear.py` ordena por nombre
las categorías y las marcas que deriva de los productos. La API las devolvía en el
orden de la base de datos, que es el de creación.

Quedan 29 categorías y 43 marcas, alfabéticas en el filtro del catálogo y en la
vitrina de la portada.

---

## 3. «Solicitar cotización pide el nombre del producto y no aparece la imagen»

**Archivo:** `ajustes.js` (nuevo, no toca el bundle)

El formulario de cotización ya sabía rellenarse solo: su constructor lee el carrito y,
si tiene algo, monta cada línea con nombre, marca, cantidad **y foto**. Lo que fallaba
es que «Solicitar cotización» en la ficha era un enlace suelto a `/cotizacion`, así que
se llegaba con el carrito vacío y el formulario mostraba un campo de texto en blanco.

`ajustes.js` intercepta ese clic, guarda el producto en el carrito (`localStorage`,
clave `agro_cart`, con la misma forma que usa la aplicación) y navega.

La navegación es una **recarga completa**, a propósito: el carrito se lee de
`localStorage` una sola vez, al construirse el servicio, así que una navegación interna
no vería lo que se acaba de guardar y el formulario volvería a salir vacío.

Sólo se intercepta desde la ficha de un producto (`/catalogo/:id`) y nunca desde el pie
de página, cuyo enlace es de navegación y no debe arrastrar nada.

---

## 4. «El botón de WhatsApp no aparece / está desactivada la comunicación»

**Archivo:** `ajustes.js` + `data/settings.json`

Eran dos problemas distintos:

- **No aparecía** fuera de la portada porque el botón vive dentro del componente
  `app-home`. `ajustes.js` añade uno propio, fijo abajo a la derecha, en todas las
  demás páginas. En la portada se esconde para no duplicar el de la aplicación, que
  además lleva su globo de «¿Te ayudo a cotizar?».
- **No comunicaba** porque el número no estaba configurado y la aplicación caía a su
  valor por defecto, `573000000000`. Ahora `data/settings.json` lleva el número real,
  y los dos botones apuntan al mismo sitio porque ambos lo leen de ahí.

---

## 5. Hosting, capacidad y velocidad

Sin parche: es justo lo que resuelve esta copia. El sitio pasa a ser estático —sin PHP,
sin base de datos, sin backend—, así que puede servirse desde GitHub Pages o desde
cualquier CDN, con las imágenes y el catálogo dentro del propio repositorio.

**Lo que esta copia no puede hacer:** enviar cotizaciones, solicitudes de servicio
técnico ni registrar usuarios. Esos formularios siguen apuntando al backend real y, sin
él, fallan a la vista. Está sin resolver a propósito: fingir un envío que nadie va a
recibir sería peor, sobre todo con la campaña de Google Ads en marcha.

---

## 6. Buscador en el filtro de marcas

**Archivo:** `ajustes.js` (no toca el bundle)

El catálogo ya filtraba por marca y funcionaba. El problema era encontrarla: 43 marcas
en una lista de radios de **1.251 px**, sin buscador y sin scroll propio. Y por encima,
otras 29 categorías, así que el bloque de marcas quedaba a media página de scroll.

Tres añadidos sobre el filtro que ya existía:

- **Buscador** que va escondiendo las marcas que no coinciden según se escribe. Ignora
  mayúsculas y tildes, y «Todas» nunca se oculta. Si nada coincide, lo dice.
- **Número de productos** junto a cada marca, como ya hacen las pestañas de la portada.
  Se cuentan sobre `data/products.json`: la API no los trae en `/brands`.
- **Altura máxima con scroll** en las dos listas, marcas y categorías. Recortar sólo la
  de marcas no habría servido de nada, porque el bloque seguiría llegando después de
  las 29 categorías. El panel pasa de más de 1.600 px a 673, cabe en pantalla y el
  `sticky top-40` que ya tenía vuelve a tener sentido: antes, siendo más alto que la
  ventana, no se quedaba fijo.

Un detalle del que depende todo: los radios del filtro llevan `value="on"`, porque
Angular ata el valor al modelo y no al atributo del DOM. Desde fuera, la única forma de
saber a qué marca corresponde cada fila es su **texto**, así que los conteos se indexan
por nombre normalizado. `«Todas»` es la excepción: esa sí trae `value=""`.

---

## 7. Enlaces de Instagram

**Archivos:** `data/settings.json` + `ajustes.js` (no toca el bundle)

Los enlaces no funcionaban porque el usuario guardado era `agroforestalcolombia`, sin el
«de». La aplicación arma sus enlaces como `instagram.com/<usuario>`, así que los seis de
la portada —las cinco fotos del feed y «Ver más en Instagram»— llevaban a una cuenta que
no existe. El usuario correcto es `agroforestaldecolombia`.

Ojo al corregirlo en el futuro: la pieza gráfica de los 50 años y las propias imágenes
del feed dicen **@AgroforestalColombia**, sin el «de». El perfil real que indicó el
cliente es `https://www.instagram.com/agroforestaldecolombia/`, así que el material
impreso lleva el usuario antiguo.

Además:

- **El pie de página no enlazaba.** `@agroforestalcolombia` era texto suelto escrito en
  el bundle, junto a su icono, sin `<a>` alguno. `ajustes.js` lo convierte en enlace
  conservando el icono, así que ahora hay acceso a Instagram desde todas las páginas y
  no sólo desde la portada.
- **Se normaliza el destino.** La aplicación construye `instagram.com/<usuario>`, sin
  `www` y sin barra final; los enlaces se reescriben al perfil canónico
  `https://www.instagram.com/agroforestaldecolombia/`, y todos abren en pestaña nueva.

Queda a propósito sin enlazar el rótulo `@agroforestaldecolombia` que encabeza la
sección «Síguenos en redes» de la portada: es una etiqueta decorativa, como «EXPLORA LA
TIENDA» o «CATÁLOGO SELECTO», y justo debajo están las fotos y el botón, que sí enlazan.

---

## 8. Envío por correo de las cotizaciones y las solicitudes de servicio

**Archivos:** `formularios.js` (nuevo) + `offline-api.js` + `data/settings.json`

Una página estática no puede enviar correo: no hay servidor que lo haga. Antes esos dos
formularios los recibía el backend, que era quien mandaba el correo. Ahora los recoge un
servicio de reenvío y los entrega en `agroforestalventa@yahoo.com`.

`offline-api.js` ya interceptaba las llamadas a la API, pero sólo las de lectura. Ahora
también atiende los `POST` de `/quotes` y `/service-requests` y se los pasa a
`formularios.js`. El resto de `POST` —el login y el registro— siguen saliendo al backend
como siempre: no se envían por correo, porque llevan contraseñas.

### Activación, y qué pasa hasta entonces

La primera vez que alguien envíe algo, el servicio manda un correo de confirmación a
`agroforestalventa@yahoo.com`. **Hasta que se pulse ese enlace, ningún envío llega.**

Por eso hay plan B: si el servicio rechaza el envío o no responde, se le ofrece al
cliente mandarlo por correo, por WhatsApp o copiarlo al portapapeles, con todo ya
redactado, y el formulario conserva lo que escribió. Nunca se muestra un «enviado» que
no sea cierto: el mensaje de éxito de la aplicación sólo aparece cuando el servicio
confirma que lo aceptó.

Conviene hacer un envío de prueba nada más publicar, para disparar esa confirmación
antes de que llegue el primer cliente de la campaña.

### El correo que llega

Los campos van con nombre en español y en orden de lectura, no con los nombres internos
del formulario. El asunto lleva el nombre de quien escribe y el `responder` apunta a su
correo, así que se le contesta directamente desde el mensaje.

```
Asunto: Cotización desde la web — Juan Pérez
  Nombre, Correo, Teléfono
  Productos    1. MOTOSIERRA STIHL MS 162 — cantidad: 1
               2. MOTOSIERRA STIHL MS 212 — cantidad: 1
  Notas, Enviado desde
```

Para servicio técnico: tipo de servicio (con su nombre, no el código interno), marca,
modelo y descripción del problema.

### Cambiar el destinatario

Está en `data/settings.json`, en `formularios`: `destino` es la dirección a la que
apunta el plan B y `endpoint` la del servicio. Cambiar la dirección es cambiar las dos.

**El correo queda a la vista** en `settings.json` y en la propia petición, así que es
rastreable por robots de spam. FormSubmit permite sustituirlo por un identificador
aleatorio que oculta la dirección: si empieza a llegar correo basura, se pide ese
identificador y se cambia sólo el `endpoint`.
