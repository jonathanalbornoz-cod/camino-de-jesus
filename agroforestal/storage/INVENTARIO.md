# Inventario de imágenes

Las imágenes conservan el nombre UUID con que las guarda el backend, porque es el
que aparece en los campos `logo_url`, `hero_images`, `story_image`, `mascot_image`,
`feed_images` y `cover_image` que devuelve la API. Renombrarlas rompería esa
correspondencia.

## branding/ (12)

| Archivo | Tamaño | Qué es |
|---|---|---|
| `7d29288d-…-64ee22913285.png` | 710×124 | **Logo horizontal** «AGROFORESTAL de Colombia S.A.S · 1977». El del navbar y el pie. |
| `efce8d97-…-9f0c081843a0.png` | 1073×1600 | **Mascota** 3D con fondo transparente (RGBA). La del globo de WhatsApp. |
| `ba13cfee-…-b18aaf84ffe3.jpeg` | 1066×1600 | **Foto de historia**: hombre en el taller, sección «Nuestra historia». |
| `a717d46f-…`, `b6308755-…` (jpeg) | 1073×1600 | Versiones anteriores de la mascota, con fondo de tienda. Sin uso. |
| `3bb7aab7`, `7342cca9`, `852006be` (png) | 196×192 | **Isotipo** (sol sobre campo), tres subidas del mismo archivo. |
| `0173084c`, `105dec01`, `5179c2a6`, `990b72f9` (png) | 64×63 | **Favicon**, cuatro subidas del mismo archivo. |

Los duplicados son subidas sucesivas desde el panel de administración; se conservan
porque cualquiera de ellos puede ser el que la base de datos referencia hoy.

## hero/ (9)

Carrusel de portada. Ocho fotografías de trabajo en campo (sopladora, guadaña,
motobomba, cortadora de concreto, taller) más dos piezas gráficas: el banner de
«50 años impulsando el trabajo del campo» y la comparativa «Motoazada vs Motocultor».

## feed/ (5)

Piezas de Instagram: motoazadas y motocultores, la comparativa, el horario de
atención, el surtido de repuestos y «Tu equipo en manos expertas».

## products/ (478)

Imágenes de producto, de `products2.zip`, que es la exportación de mayor calidad:
mismos nombres que `products.zip` pero con 52 JPEG menos comprimidos, a igualdad de
dimensiones.

Son una mezcla de fotografías de producto y tablas de especificaciones técnicas, así
que **cada producto tiene varias**. Cuál pertenece a cuál solo lo dice el campo
`cover_image` (y el array `images`) de `/api/products`: el nombre UUID no lo revela.
