# Fotos de la clínica

Copia aquí las fotos y la página las publica sola: **no hay que tocar el código**.

## Nombres de archivo

| Archivo | Dónde aparece | Proporción recomendada |
|---|---|---|
| `clinica.jpg` | Imagen principal del inicio | vertical 4:5 · 1200 × 1500 px |
| `galeria-1.jpg` … `galeria-24.jpg` | Galería, en ese orden | cualquiera (el mosaico respeta la proporción) |

Se aceptan `.jpg`, `.jpeg`, `.png` y `.webp`.

**Numéralas seguidas** (5, 6, 7…): la página recorre los números en orden y deja de buscar
cuando encuentra tres seguidos sin archivo. Un hueco suelto no molesta, pero un salto grande
(por ejemplo de `galeria-4` a `galeria-12`) haría que las últimas no se vean.

## Cómo subirlas desde GitHub, sin instalar nada

1. Entra a la carpeta `high-smile/assets/img/galeria/` en el repositorio.
2. **Add file → Upload files** y arrastra las fotos (ya renombradas).
3. Escribe un mensaje corto y pulsa **Commit changes**.
4. En uno o dos minutos GitHub Pages publica el cambio.

## Recomendaciones

- Usa fotos propias de la clínica o con autorización de los pacientes.
- Comprime antes de subir: menos de 300 KB por imagen para que la página cargue rápido.
- El lado más largo, entre 1200 y 1600 px, es más que suficiente.
- Evita fotos con texto incrustado: ese texto no se puede traducir al inglés.

## Texto alternativo (accesibilidad y SEO)

Cada foto tiene una descripción en `assets/js/i18n.js` bajo la clave `foto.1`, `foto.2`…
Las cuatro primeras ya están descritas; las demás usan un texto genérico. Si quieres
describir una foto nueva, edita esa clave en los diccionarios `es` y `en`.
