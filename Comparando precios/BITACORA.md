# Bitácora del proyecto

Notas de las sesiones de trabajo, para retomar sin tener que reconstruir el
contexto. La última sesión queda arriba.

---

## Sesión 1 — 20 de agosto de 2026

Rama: `claude/comparando-precios-folder-b09tza`
Commits: `aa03682` (carpeta y comparador) · `a9d3e54` (página de ofertas)

### Qué se pidió

1. Crear la carpeta «Comparando precios» para un proyecto nuevo: una app y una
   página web.
2. Una página web con ofertas, número de artículos, precios, historial de
   precios con gráfica, comparación visual lado a lado con otras tiendas
   (incluida Amazon) y reseñas consolidadas de varias tiendas. Artículos
   electrónicos.

### Qué quedó hecho

**Comparador de precio por unidad** (lo primero que se construyó)

- `comun/comparador.js` — motor de cálculo: precio por kg, litro, unidad o
  metro; packs de varios envases; guardado en el dispositivo.
- `comun/interfaz.js` — formulario y lista de resultados, compartidos por la
  web y la app.
- `web/index.html` — página de inicio.
- `app/` — versión móvil instalable (PWA) que funciona sin internet.
- `sw.js` — caché offline, en la raíz del proyecto para alcanzar `comun/`.

**Página de ofertas de electrónica**

- `web/ofertas.html`, `web/ofertas.css`, `web/ofertas.js` — cifras de cabecera,
  filtros, rejilla de artículos, detalle con comparación lado a lado, historial
  y reseñas.
- `comun/grafica.js` — gráficas en SVG sin librerías (líneas con cruceta,
  barras, mini gráfica de tarjeta).
- `datos/catalogo.js` — catálogo de DEMOSTRACIÓN: 10 artículos, 10 tiendas.
- `herramientas/generar-catalogo.py` — rehace ese catálogo.
- `comun/fuentes.js` — enchufe para las APIs reales; hoy ninguna conectada.

### Decisiones que conviene no re-discutir

- **Los precios son inventados y la página lo dice arriba de todo.** Ninguna
  tienda entrega precios a una página web directamente: lo impiden CORS, las
  claves de API no pueden ir en el HTML y raspar sus páginas va contra sus
  términos. Los enlaces de cada tienda llevan a su buscador real, no a un
  producto falso.
- El catálogo de demostración es coherente consigo mismo: el historial termina
  exactamente en el precio actual, la nota global es el promedio ponderado real
  de las notas por tienda y el reparto de estrellas cuadra con esa nota. Si se
  edita a mano hay que mantener eso; mejor volver a correr el generador.
- Sin dependencias externas: nada de frameworks ni de CDN. Todo funciona
  abriendo los archivos, sin compilar.
- Código y comentarios en español, igual que el resto del repositorio.
- Los colores de las series están validados para daltonismo (separación mínima
  ΔE 9,1 en el par adyacente más difícil) y cada tienda conserva su color entre
  la gráfica, las columnas y las reseñas. Si se agregan series, revalidar.
- El sitio es solo en modo claro, a propósito. El modo oscuro está en la lista
  de ideas pendientes.

### Verificado en Chromium

Filtros, panel de detalle, cruceta de la gráfica, navegación con el teclado,
vista de tabla, persistencia al recargar, la app abriendo sin conexión y el
móvil a 390 px sin desbordes horizontales.

### Sobre las APIs de las tiendas

Confirmado buscando: la PA-API 5.0 de Amazon se retira el 15 de mayo de 2026 y
la reemplaza la Creators API (exige cuenta de Amazon Associates con ventas
recientes); la Browse API de eBay es gratuita con token de aplicación.

El resto de la tabla del README está según lo que sabía, **sin verificar una por
una** — hay que revisarlas antes de integrarlas, porque esos programas cambian
seguido.

Ninguna API entrega historial de precios: hay que guardarlo uno mismo,
consultando cada producto una o dos veces al día.

### Pendiente: ideas propuestas, esperando tu orden

Ninguna está empezada. El orden sugerido pone la 2 primero, porque las demás se
apoyan en ella.

| # | Idea | Estado |
| --- | --- | --- |
| 1 | Aviso por correo cuando un producto baja del precio elegido | por decidir |
| 2 | Servidor que consulte las APIs reales y guarde el histórico (empezar por eBay y Best Buy, que no piden permiso previo) | por decidir |
| 3 | Precio final para Chile: IVA, envío internacional y aduana | por decidir |
| 4 | Modo oscuro en todo el sitio | por decidir |
| 5 | Comparador de dos artículos distintos, con sus especificaciones enfrentadas | por decidir |
| 6 | Favoritos y lista de deseos guardados en el dispositivo | por decidir |

### Cómo retomar

```bash
git checkout claude/comparando-precios-folder-b09tza
cd "Comparando precios"
python3 -m http.server 8000
```

- `http://localhost:8000/web/` — inicio
- `http://localhost:8000/web/ofertas.html` — ofertas
- `http://localhost:8000/app/` — app

Para rehacer el catálogo de demostración:

```bash
python3 "Comparando precios/herramientas/generar-catalogo.py"
```
