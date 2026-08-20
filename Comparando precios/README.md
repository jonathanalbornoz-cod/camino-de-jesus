# Comparando precios

Proyecto para saber qué producto sale realmente más barato. El envase grande no
siempre conviene: aquí se compara el precio por kilo, litro, unidad o metro,
llevando todo a la misma medida.

El proyecto tiene tres piezas que comparten el mismo motor de cálculo:

- **Página web** (`web/index.html`): presenta el proyecto y deja probar el comparador.
- **Ofertas de electrónica** (`web/ofertas.html`): catálogo de artículos comparados
  tienda por tienda, con historial de precios, gráfica y reseñas consolidadas.
- **App** (`app/`): versión móvil instalable (PWA) que funciona sin internet,
  pensada para usarla en el supermercado.

> ⚠ **Los datos de la página de ofertas son inventados.** Sirven para mostrar la
> página funcionando; no son precios reales de Amazon ni de ninguna otra tienda.
> Abajo está lo que hace falta para conectar precios de verdad.

## Estructura

```
Comparando precios/
├── comun/            Código compartido
│   ├── comparador.js   Cálculo de precio por unidad, comparación y guardado
│   ├── interfaz.js     Formulario y lista de resultados
│   ├── grafica.js      Gráficas en SVG (líneas, barras, chispa)
│   ├── fuentes.js      Enchufe para las APIs reales de las tiendas
│   └── estilos.css     Estilos comunes
├── datos/
│   └── catalogo.js     Catálogo de DEMOSTRACIÓN (precios inventados)
├── web/
│   ├── index.html      Página de inicio
│   ├── ofertas.html    Ofertas de electrónica
│   ├── ofertas.css
│   └── ofertas.js
├── app/
│   ├── index.html      App móvil
│   ├── manifest.json   Datos de instalación (PWA)
│   └── icono.svg       Ícono
├── herramientas/
│   └── generar-catalogo.py   Rehace datos/catalogo.js
├── sw.js             Service worker (caché para uso sin internet)
└── README.md
```

## Cómo probarlo

No hace falta instalar nada, pero conviene abrirlo con un servidor local para
que funcione el modo sin conexión:

```bash
cd "Comparando precios"
python3 -m http.server 8000
```

Luego abre:

- `http://localhost:8000/web/` — página de inicio
- `http://localhost:8000/web/ofertas.html` — ofertas de electrónica
- `http://localhost:8000/app/` — app móvil

## Qué calcula

| Dato que ingresas | Ejemplo |
| --- | --- |
| Precio total | 5200 |
| Contenido | 5 |
| Unidad | kg |
| Envases del pack | 1 |

Con eso la app entrega el precio por unidad base (kg, L, unidad o m), marca el
más barato y muestra cuánto de más cuesta cada uno de los otros. Los productos
medidos en peso solo se comparan con los de peso, los de volumen con los de
volumen, y así con cada familia de unidades.

## La página de ofertas

Qué muestra cada parte:

- **Cifras de cabecera**: cuántos artículos hay, cuántos precios están por debajo
  del precio de lista, cuántas tiendas se comparan y cuál es el mayor descuento.
- **Filtros**: búsqueda por texto, categoría, tienda y orden (mayor descuento,
  menor precio, mejor valorados, nombre).
- **Comparación lado a lado**: una columna por tienda con precio, envío, precio
  final, entrega, existencias y valoración. La barra de cada columna es
  proporcional al precio final, así se ve la diferencia sin leer números.
- **Historial de precios**: 90 días de las cuatro tiendas con seguimiento, con
  cruceta al pasar el puntero, navegación con las flechas del teclado y vista de
  tabla. Debajo van mínimo, promedio, máximo y un veredicto de si conviene
  comprar ahora.
- **Reseñas consolidadas**: la nota global es el promedio **ponderado** por la
  cantidad de reseñas de cada tienda, no un promedio simple. Se acompaña del
  reparto de estrellas, la nota de cada tienda y los temas que más se repiten.

Los colores de las series están validados para daltonismo (separación mínima
ΔE 9,1 en el par adyacente más difícil) y cada tienda conserva su color entre la
gráfica, las columnas y las reseñas.

## Cómo conectar precios reales

La página no puede consultar las tiendas directamente desde el navegador: lo
impide CORS, las claves de API no pueden ir en el HTML y los términos de uso de
casi todas las tiendas prohíben raspar sus páginas. La vía correcta es un
servidor propio que hable con las APIs, guarde el histórico y entregue un JSON
con la forma de `datos/catalogo.js`.

| Tienda | Acceso | Cómo |
| --- | --- | --- |
| Amazon | API de afiliados | Creators API (reemplaza a la PA-API 5.0, retirada el 15-05-2026). Exige cuenta activa de Amazon Associates. |
| eBay | API oficial | Browse API, gratuita, con token de aplicación. |
| Best Buy | API oficial | Clave gratuita en developer.bestbuy.com. |
| Walmart | API de afiliados | Walmart I/O, con aprobación como partner. |
| AliExpress | API de afiliados | AliExpress Open Platform. |
| MercadoLibre | API oficial | developers.mercadolibre.com, OAuth. |
| Newegg, B&H, Target, Costco | Sin API pública | Feed de su programa de afiliados o acuerdo directo. |

Verifica las condiciones de cada programa antes de publicar nada: cambian seguido
y varias exigen mostrar la marca y la fecha del precio.

El histórico de precios no lo entrega ninguna API: hay que guardarlo uno mismo,
consultando cada producto una o dos veces al día y acumulando los resultados.

## Ideas para más adelante

- Aviso por correo cuando un producto baja del precio que tú elijas.
- Modo oscuro.
- Lector de códigos de barras con la cámara.
- Comparar el precio con impuestos y aduana para las compras fuera del país.
- Guardar favoritos y una lista de deseos.

El registro de lo que se hizo en cada sesión, las decisiones tomadas y lo que
quedó pendiente está en [BITACORA.md](BITACORA.md).

Proyecto de Jonathan Albornoz.
