# Agroforestal de Colombia — sitio web

Copia de [agroforestaldecolombia.com](https://agroforestaldecolombia.com) que funciona
**sin el backend**: el contenido está horneado dentro del repositorio.

## Cómo está montado

La aplicación es un build de producción de Angular (compilado, con hashes en los
nombres). Tal cual, pide sus datos a `api.agroforestaldecolombia.com`. Aquí no puede:
GitHub Pages sólo sirve archivos estáticos y la API no acepta este origen.

En vez de reescribir la aplicación, `offline-api.js` intercepta esas llamadas y las
responde con los JSON de `data/`. Se carga como script clásico desde `index.html`, así
que se ejecuta antes que los módulos de la app, que van diferidos.

```
index.html          calcula <base> en tiempo de ejecución y carga el interceptor
offline-api.js      responde /settings /categories /brands /products /posts
data/*.json         el contenido, tal como lo devuelve la API
storage/            las imágenes que antes servía el backend
main-*.js, chunk-*  la aplicación compilada, sin modificar
.htaccess           reglas de Apache/Hostinger (rewrite SPA + caché)
```

La aplicación compilada **no está parcheada**. Si algún día la API acepta este origen,
basta con borrar la línea del interceptor en `index.html` y el sitio vuelve a tirar del
backend en vivo.

### Qué se responde en local y qué no

El interceptor sólo atiende peticiones `GET` para las que hay datos. Todo lo demás sale
a la red como siempre: los envíos de cotizaciones, las solicitudes de servicio, el login
y el registro siguen apuntando al backend real. Es deliberado — más vale que un
formulario falle a la vista que fingir un envío que nadie va a recibir.

En la práctica, mientras la API no acepte este origen, esos formularios darán error de
red. Si el sitio va a vivir aquí de forma permanente, conviene sustituirlos por WhatsApp.

### Filtros y paginación

Los hacía el servidor. Ahora los hace `offline-api.js` sobre la lista completa:
categoría, marca, búsqueda por texto, destacados y paginación, devolviendo la misma
envoltura (`data`, `total`, `current_page`, `last_page`) que espera la aplicación. El
filtro de categoría y marca acepta slug, id o nombre, porque la aplicación usa el slug
pero los datos traen las tres cosas.

## Actualizar el contenido

Cuando cambie el catálogo, se piden los JSON a la API y se vuelven a hornear:

```bash
python3 tools/hornear.py products.json products-pagina2.json posts.json
```

El script fusiona por id, admite varias páginas del mismo recurso y reescribe las URL de
imagen a las copias locales. Las categorías y las marcas se derivan de los objetos que
cada producto trae anidados, así que no hay que pedirlas aparte.

Las imágenes nuevas van a `storage/products/`. El script las reconoce con o sin el
sufijo `_min` que traen las exportaciones.

## Estado del contenido

| Recurso | Horneado | Notas |
|---|---|---|
| Productos | 200 de 276 | Falta la página 2 de la API (`/api/products?page=2`) |
| Categorías | 20 | Derivadas de los productos |
| Marcas | 32 | Derivadas de los productos |
| Blog | 1 | «5 tips de cuidado para las guadañas» |
| Imágenes de producto | 478 | Las 351 que referencian los 200 productos resuelven en local |
| Portada, logo, mascota, feed | 26 | Ver `storage/INVENTARIO.md` |

`data/settings.json` está escrito a mano, no viene de la API: contiene el nombre, el
eslogan, la dirección, los teléfonos, el Instagram y las rutas del logo, la mascota, la
foto de historia, la portada y el feed. Los teléfonos salen de la pieza gráfica de los
50 años; conviene contrastarlos con `/api/settings` cuando se pueda.

## Rutas

`/` · `/catalogo` · `/catalogo/:id` · `/blog` · `/blog/:id` · `/marcas` · `/productos` ·
`/categorias` · `/servicio-tecnico` · `/cotizacion` · `/mi-cuenta` · `/perfil` ·
`/auth`, `/login`, `/register` · `/admin`, `/dashboard`, `/solicitudes`, `/cotizaciones`

Las de `/admin` y las de cuenta necesitan el backend: se ven, pero no cargan ni guardan.

## Dónde se puede servir

- **GitHub Pages**: funciona tal cual. La etiqueta `<base>` se calcula en tiempo de
  ejecución, así que da igual la raíz de un dominio que una subcarpeta. Las rutas
  profundas las recupera el `404.html` de la raíz del repositorio.
- **Apache/Hostinger**: subir el contenido de esta carpeta a `public_html`. El
  `.htaccess` reescribe cualquier ruta a `index.html`.
- **Local**: `python3 -m http.server` desde la raíz del repositorio y abrir
  `http://localhost:8000/agroforestal/`.
