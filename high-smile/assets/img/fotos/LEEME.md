# Fotos de la clínica

Copia aquí las fotos y la página las publica sola: **no hay que tocar el código**.

## Nombres de archivo

| Archivo | Dónde aparece |
|---|---|
| `hero.jpg` | Fondo de la portada en computador y tablet (horizontal) |
| `hero-movil.jpg` | El mismo fondo recortado en vertical, para el teléfono |
| `clinica-1.jpg` … `clinica-12.jpg` | Carrusel de «Reseña clínica» |
| `caso-1.jpg` … `caso-12.jpg` | Carrusel de «Casos de éxito» (antes y después) |
| `paciente-1.jpg` … `paciente-12.jpg` | Carrusel de «Antes y después · pacientes» |
| `equipo-2.jpg` … `equipo-5.jpg` | Fotos de «Nuestro equipo», en ese orden |
| `cali-1.jpg`, `cali-2.jpg`, `cali-3.jpg` | Turismo dental: Cristo Rey, Torre de Cali y cholados (horizontal 4:3) |

Se aceptan `.jpg`, `.png` y `.webp`.

**Numera seguido.** Cada carrusel recorre los números en orden y deja de buscar cuando
encuentra dos seguidos sin archivo; un hueco suelto no molesta, un salto grande sí.

## Tamaños recomendados

- Portada en computador (`hero.jpg`): horizontal, 1920 × 1280 px, menos de 250 KB.
- Portada en teléfono (`hero-movil.jpg`): vertical, 1100 × 1650 px, menos de 160 KB.
  Es la misma fotografía recortada: en una pantalla estrecha, el encuadre ancho
  dejaría a las personas fuera. Conviene recortarla centrada en lo importante.
- Carruseles: vertical 4:5, entre 900 y 1200 px de ancho, menos de 200 KB.
- Equipo: vertical 4:5, 900 × 1350 px.

Las fotos originales de la cámara (4000 px, varios MB) hacen la página muy lenta:
reduce el tamaño antes de subirlas.

## Cómo subirlas desde GitHub, sin instalar nada

1. Entra a la carpeta `high-smile/assets/img/fotos/` en el repositorio.
2. **Add file → Upload files** y arrastra las fotos ya renombradas.
3. Escribe un mensaje corto y pulsa **Commit changes**.

## Si reemplazas una foto conservando el nombre

**Ojo con las dos fotos de portada.** Son las únicas que no pasan por el sistema
automático: van escritas directamente en `index.html`, con su `?v=` al final. Si
las reemplazas, sube ese número **a mano en las tres apariciones** (las dos etiquetas
`<link rel="preload">` del `<head>` y el `<picture>` de la portada), además del paso
de abajo.

Sube el número de `VERSION_FOTOS` en `assets/js/app.js` (por ejemplo de `'4'` a `'5'`):
así los navegadores no muestran la copia vieja que tenían en caché.

## Texto alternativo (accesibilidad y SEO)

La descripción de cada foto vive en `assets/js/i18n.js` con la clave
`foto.<carrusel>.<número>` — por ejemplo `foto.clinica.3`. Si no existe la clave, se usa la
descripción general del carrusel (`foto.clinica`, `foto.caso`, `foto.paciente`).
