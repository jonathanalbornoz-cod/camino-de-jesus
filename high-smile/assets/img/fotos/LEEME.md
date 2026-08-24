# Fotos de la clínica

Copia aquí las fotos y la página las publica sola: **no hay que tocar el código**.

## Nombres de archivo

| Archivo | Dónde aparece |
|---|---|
| `hero.jpg` | Fondo de la portada (se recorta a pantalla completa) |
| `clinica-1.jpg` … `clinica-12.jpg` | Carrusel de «Reseña clínica» |
| `caso-1.jpg` … `caso-12.jpg` | Carrusel de «Casos de éxito» (antes y después) |
| `paciente-1.jpg` … `paciente-12.jpg` | Carrusel de «Antes y después · pacientes» |
| `equipo-1.jpg` … `equipo-4.jpg` | Fotos de «Nuestro equipo» |
| `cali-1.jpg`, `cali-2.jpg`, `cali-3.jpg` | Turismo dental: Cristo Rey, Torre de Cali y cholados (horizontal 4:3) |

Se aceptan `.jpg`, `.png` y `.webp`.

**Numera seguido.** Cada carrusel recorre los números en orden y deja de buscar cuando
encuentra dos seguidos sin archivo; un hueco suelto no molesta, un salto grande sí.

## Tamaños recomendados

- Portada (`hero.jpg`): vertical, 1500 × 2250 px, menos de 250 KB.
- Carruseles: vertical 4:5, entre 900 y 1200 px de ancho, menos de 200 KB.
- Equipo: vertical 4:5, 900 × 1350 px.

Las fotos originales de la cámara (4000 px, varios MB) hacen la página muy lenta:
reduce el tamaño antes de subirlas.

## Cómo subirlas desde GitHub, sin instalar nada

1. Entra a la carpeta `high-smile/assets/img/fotos/` en el repositorio.
2. **Add file → Upload files** y arrastra las fotos ya renombradas.
3. Escribe un mensaje corto y pulsa **Commit changes**.

## Si reemplazas una foto conservando el nombre

Sube el número de `VERSION_FOTOS` en `assets/js/app.js` (por ejemplo de `'4'` a `'5'`):
así los navegadores no muestran la copia vieja que tenían en caché.

## Texto alternativo (accesibilidad y SEO)

La descripción de cada foto vive en `assets/js/i18n.js` con la clave
`foto.<carrusel>.<número>` — por ejemplo `foto.clinica.3`. Si no existe la clave, se usa la
descripción general del carrusel (`foto.clinica`, `foto.caso`, `foto.paciente`).
