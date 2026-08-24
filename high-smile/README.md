# High Smile · Clínica Odontológica (Cali) — sitio web

Sitio web en **español e inglés** para High Smile Clínica Odontológica, en Santiago de Cali.
Portada horizontal a pantalla completa, paleta **negro dominante, blanco y gris**, y el
logotipo oficial de la clínica.

---

## 1. Datos de la clínica usados en el sitio

| Dato | Valor |
|---|---|
| Nombre | High Smile Clínica Odontológica |
| Dirección | Calle 14 #84a-05, Edificio Benessere, consultorio 310 · Santiago de Cali |
| WhatsApp (canal principal) | +57 315 825 3729 |
| Teléfono | +57 300 523 9827 |
| Atención | Solo con cita previa (la clínica no publica horario fijo) |
| Correo | highsmilecali@gmail.com |
| Instagram | [@highsmile_co](https://www.instagram.com/highsmile_co/) |
| Facebook | [High Smile Clínica Odontológica](https://www.facebook.com/people/High-Smile-Cl%C3%ADnica-Odontol%C3%B3gica/61579892912629/) |
| Eslogan | Cuidamos tu sonrisa con detalle y confianza |
| Especialidades | Ortodoncia · Periodoncia · Implantología oral · Rehabilitación oral · Cirugía oral y maxilofacial · Endodoncia · Diseño de sonrisa · Limpieza dental |
| Trayectoria | 10 años de experiencia · más de 3.000 pacientes |

---

## 2. Secciones de la página

| Pestaña | Contenido |
|---|---|
| Portada | Imagen a pantalla completa, logotipo, eslogan y accesos a agenda y WhatsApp |
| Servicios | Las ocho especialidades, cada una con su ilustración propia |
| Reseña clínica | Quiénes son, método de trabajo y carrusel de fotos de la clínica |
| Casos de éxito | Carrusel de antes y después |
| Antes y después | Carrusel con los pacientes que terminaron su tratamiento |
| Nuestro equipo | Cuatro perfiles con foto o retrato ilustrado, especialidad y años de experiencia |
| Turismo dental | Por qué tratarse en Cali, cómo se organiza el viaje y qué ver en la ciudad |
| Preguntas frecuentes | Agendamiento, provisionales y definitivos, tiempos de entrega, cuidados y miedo al odontólogo |
| Contacto | Canales, mapa de Google cargado directamente y envío de fotos para valoración a distancia |

Además: `agenda.html` (formulario de agendamiento en tres pasos) y `privacidad.html`
(política de privacidad y habeas data).

---

## 3. Archivos

| Archivo | Descripción |
|---|---|
| `index.html` | Página principal con todas las secciones |
| `agenda.html` | Landing de agendamiento |
| `privacidad.html` | Política de privacidad (Ley 1581 de 2012) |
| `assets/css/estilos.css` | Diseño completo: paleta, componentes, responsive e impresión |
| `assets/js/i18n.js` | Traducción español/inglés: motor y los dos diccionarios |
| `assets/js/app.js` | Menú, acordeón, carruseles, carga de fotos y envío de imágenes |
| `assets/js/agenda.js` | Formulario por pasos con validaciones |
| `assets/img/logo-*.png` | Logotipos oficiales (horizontal blanco y negro, vertical blanco) |
| `assets/img/fotos/` | Fotografías de la clínica · ver `LEEME.md` dentro de la carpeta |
| `assets/img/ilustraciones/` | Dibujos SVG: los ocho servicios, los íconos de Cali y dos retratos del equipo |
| `_headers` | Cabeceras de seguridad para hostings que las permiten |

Sin frameworks, sin `npm install`, sin dependencias externas: HTML, CSS y JavaScript puro.

---

## 4. Fotografías

Las fotos que envió la clínica están reducidas para web (las originales pesaban entre 1,4 y
3,7 MB cada una; ahora ninguna pasa de 165 KB). Para agregar o reemplazar fotos, todo está
explicado en `assets/img/fotos/LEEME.md`: basta con copiarlas en esa carpeta con el nombre
que corresponde y la página las publica sola.

Las ilustraciones de los servicios y de Cali (Cristo Rey, la Torre de Cali y los cholados)
son dibujos vectoriales hechos para el sitio: pesan menos de 1 KB cada uno y se ven nítidos
en cualquier pantalla. Se pueden reemplazar por fotografías cuando la clínica las tenga.

---

## 5. Datos de ejemplo y pendientes

**Equipo (datos de ejemplo).** La clínica pidió perfiles de muestra mientras llegan los
definitivos, así que los cuatro integrantes que aparecen —nombres, especialidades y años de
experiencia— **son inventados para esta versión de presentación**. Dos usan fotografías
reales de la clínica y dos, retratos ilustrados. La propia sección lo advierte al pie.

Para reemplazarlos por los reales:

1. Cambia el texto en `assets/js/i18n.js`, claves `equipo.1.*` … `equipo.4.*` (en español y
   en inglés).
2. Copia la fotografía en `assets/img/fotos/` como `equipo-1.jpg` … `equipo-4.jpg`.
3. En `index.html`, cambia el bloque `perfil__foto--ilustracion` por
   `<div class="perfil__foto marco" data-foto="fotos/equipo-3">…` para que use la foto.
4. Sube `VERSION_FOTOS` en `assets/js/app.js`.

**Pendientes reales:**

1. **Envío automático de las fotos del paciente.** Hoy la página prepara el mensaje y el
   paciente adjunta las imágenes en WhatsApp o en el correo. Para que lleguen solas a
   highsmilecali@gmail.com hace falta un servicio de formularios o un backend propio.
2. **Textos.** La redacción es una propuesta; conviene que la clínica la revise, sobre todo
   la política de privacidad.

---

## 6. Idiomas

El selector **ES / EN** está en la cabecera de las tres páginas.

- Todos los textos viven en `assets/js/i18n.js`, en dos diccionarios con las mismas claves.
- Se traducen el `<title>`, la meta descripción, los textos del formulario, las etiquetas del
  resumen de la cita y el texto alternativo de cada foto.
- La elección se guarda en el navegador; si nunca ha elegido, se usa el idioma del navegador.

Para cambiar un texto: busca su clave (por ejemplo `hero.titulo`) y edítala en `es` y en `en`.

---

## 7. Mapa

La sección de contacto muestra el mapa de Google centrado en la dirección de la clínica,
cargado directamente al abrir la página, como pidió la clínica. Si quieren el pin
exactamente sobre la puerta, envíen las coordenadas y se ajusta la URL del `<iframe>` en
`index.html`.

---

## 8. Cómo verlo

**Servidor local** (recomendado):

```bash
cd high-smile
python3 -m http.server 8080
# abrir http://localhost:8080
```

**GitHub Pages:** con Pages configurado sobre esta rama y carpeta `/ (root)`, el sitio queda en
`https://<usuario>.github.io/camino-de-jesus/high-smile/`

---

## 9. Seguridad y privacidad

- **Content Security Policy** restrictiva en cada página y en `_headers`. La única excepción
  es `frame-src` para el mapa de Google.
- **Sin cookies, sin analítica y sin pixeles** de redes sociales.
- **Las fotos del paciente no se suben a ningún servidor:** se previsualizan en su propio
  dispositivo y se adjuntan al mensaje que él mismo envía.
- **Minimización de datos** en el formulario: nombre, celular, motivo y preferencia horaria.
- **Sin `innerHTML`:** lo que escribe el paciente se pinta con `textContent`, lo que impide
  inyecciones de HTML o scripts (XSS).
- **Validación** de cada campo y **consentimiento explícito** de habeas data antes de enviar.
- **Enlaces externos** siempre con `rel="noopener noreferrer"`.

---

## 10. Convenciones de código

- **`const` por defecto, `let` solo por excepción:** en todo el JavaScript hay dos `let`
  (`pasoActual` en el formulario e `idiomaActual` en el traductor).
- Modo estricto (`'use strict'`) e IIFE para no contaminar el ámbito global.
- Sin atributos `style=` en el HTML: todo va en clases, para mantener `style-src 'self'`.
- HTML semántico y accesible: `aria-*`, roles, foco visible, navegación por teclado,
  carruseles manejables con el teclado y respeto por `prefers-reduced-motion`.
