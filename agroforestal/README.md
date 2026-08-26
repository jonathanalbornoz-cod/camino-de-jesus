# Agroforestal de Colombia — sitio web

Copia exacta del sitio en producción de [agroforestaldecolombia.com](https://agroforestaldecolombia.com),
tomada del despliegue del **14 de julio de 2026** (`public_html`).

## Qué es

Es una aplicación **Angular ya compilada** (build de producción con AOT + hashes en los
nombres de archivo). No es el código fuente TypeScript: son los bundles que sirve el
servidor. Se subieron únicamente los archivos que usa el build vigente (44 archivos,
~1,1 MB); el `public_html` original acumulaba también bundles de despliegues anteriores.

```
index.html              punto de entrada (app-root)
polyfills-*.js          polyfills de Angular
main-*.js               bundle principal
chunk-*.js              chunks compartidos y rutas con carga diferida
styles-*.css            hoja de estilos global (Tailwind + Swiper)
favicon.ico / .svg      iconos
logo-agroforestal.svg   logo
.htaccess               reglas de Apache/Hostinger (rewrite SPA + caché)
```

## Rutas de la aplicación

`/` · `/catalogo` · `/catalogo/:id` · `/blog` · `/blog/:id` · `/marcas` · `/productos` ·
`/categorias` · `/servicio-tecnico` · `/cotizacion` · `/mi-cuenta` · `/perfil` ·
`/auth`, `/login`, `/register` · `/admin`, `/dashboard`, `/solicitudes`, `/cotizaciones`, `/configuracion`

## Datos

El catálogo, el blog y las cotizaciones se consumen del backend en
`https://api.agroforestaldecolombia.com/api`. Ese backend **no** está en este repositorio:
el sitio lo llama directamente desde el navegador. Si se sirve desde un dominio distinto
al original (por ejemplo `*.github.io`), la API debe permitir ese origen por CORS; de lo
contrario el listado quedará en «Cargando productos…».

## Cómo se sirve

- **Hosting original (Apache/Hostinger):** subir el contenido de esta carpeta a
  `public_html`. El `.htaccess` incluido reescribe cualquier ruta a `index.html`.
- **GitHub Pages:** funciona tal cual. La etiqueta `<base>` se calcula en tiempo de
  ejecución dentro de `index.html`, así que sirve igual en la raíz de un dominio que en
  una subcarpeta. Las rutas profundas (`/agroforestal/catalogo`) las recupera el
  `404.html` de la raíz del repositorio, que reenvía a `index.html` conservando la ruta.
- **Local:** `python3 -m http.server` desde la raíz del repositorio y abrir
  `http://localhost:8000/agroforestal/`.

## Cómo modificarlo

Al ser un build compilado, los textos, colores y clases de Tailwind viven dentro de los
`chunk-*.js` y de `styles-*.css` minificados. Los cambios de contenido (textos, teléfonos,
enlaces, precios fijos) se pueden aplicar sobre esos archivos. Para cambios estructurales
lo ideal es contar con el proyecto Angular original y volver a compilar.
