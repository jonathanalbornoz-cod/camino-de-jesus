# Comparando precios

Proyecto para saber qué producto sale realmente más barato. El envase grande no
siempre conviene: aquí se compara el precio por kilo, litro, unidad o metro,
llevando todo a la misma medida.

El proyecto tiene dos caras que comparten el mismo motor de cálculo:

- **Página web** (`web/`): presenta el proyecto y deja probar el comparador ahí mismo.
- **App** (`app/`): versión móvil instalable (PWA) que funciona sin internet,
  pensada para usarla en el supermercado.

## Estructura

```
Comparando precios/
├── comun/            Código compartido por la web y la app
│   ├── comparador.js   Cálculo de precio por unidad, comparación y guardado
│   ├── interfaz.js     Formulario y lista de resultados
│   └── estilos.css     Estilos comunes
├── web/
│   └── index.html      Página web
├── app/
│   ├── index.html      App móvil
│   ├── manifest.json   Datos de instalación (PWA)
│   └── icono.svg       Ícono
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

Luego abre `http://localhost:8000/web/` para la página web
o `http://localhost:8000/app/` para la app.

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

## Ideas para más adelante

- Historial de precios por producto y aviso cuando sube.
- Compartir la lista con otra persona.
- Lector de códigos de barras con la cámara.
- Precios por supermercado.

Proyecto de Jonathan Albornoz.
