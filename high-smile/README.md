# High Smile · Clínica Odontológica (Cali) — sitio web

Sitio web en **español e inglés** para High Smile Clínica Odontológica, en Santiago de Cali.
Portada horizontal a pantalla completa, paleta **negro dominante, blanco y gris**, y el
logotipo oficial de la clínica.

> **Versión de muestra para presentación interna.** Los cuatro perfiles del equipo usan
> nombres inventados sobre fotografías del material de la clínica. Antes de publicar el sitio
> al público hay que reemplazarlos por los nombres, cargos y fotografías reales de cada
> integrante, con su autorización.

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
| Nuestro equipo | Cuatro perfiles con fotografía, especialidad y años de experiencia |
| Preguntas frecuentes | Agendamiento, provisionales y definitivos, tiempos de entrega, cuidados y miedo al odontólogo |
| Contacto | Canales, dirección y mapa de Google cargado directamente |

**El menú «Contacto» de la cabecera.** Turismo dental y la valoración a distancia ocupaban
antes dos bloques enteros de la página. Ahora viven en un panel que baja desde la barra de
navegación al pulsar **Contacto**: dentro hay dos desplegables con todo su contenido, que se
abren de a uno o los dos a la vez. El panel hace scroll por dentro y se cierra con su botón
«Cerrar», con la tecla `Esc` o pulsando fuera.

- La pestaña suelta «Turismo dental» desapareció del menú: su sitio es este panel.
- El ancla `#turismo` (y la nueva `#valoracion`) sigue funcionando desde donde sea —el pie de
  página, `agenda.html`, un enlace externo—: abre el panel y despliega el bloque.
- La sección de contacto conserva dos botones de acceso a los mismos bloques, para quien
  llegue bajando por la página en vez de por el menú.
- El menú desplegable solo existe en `index.html`, que es donde vive el contenido; en
  `agenda.html` y `privacidad.html` la pestaña «Contacto» es un enlace normal a
  `index.html#contacto`.

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
| `assets/img/ilustraciones/` | Dibujos SVG de los ocho servicios |
| `_headers` | Cabeceras de seguridad para hostings que las permiten |

Sin frameworks, sin `npm install`, sin dependencias externas: HTML, CSS y JavaScript puro.

---

## 4. Fotografías

Las fotos que envió la clínica están reducidas para web (las originales pesaban entre 1,4 y
3,7 MB cada una; ahora ninguna pasa de 165 KB). Para agregar o reemplazar fotos, todo está
explicado en `assets/img/fotos/LEEME.md`: basta con copiarlas en esa carpeta con el nombre
que corresponde y la página las publica sola.

Las tres imágenes de turismo dental —Cristo Rey, la Torre de Cali y los cholados— son
fotografías (`cali-1.jpg`, `cali-2.jpg`, `cali-3.jpg`), recortadas para quitarles el marco
que traían y ajustadas a 900 × 675 px.

> Conviene confirmar los derechos de uso de esas tres fotos de la ciudad antes de publicar
> el sitio: si no son propias, lo más seguro es reemplazarlas por fotografías de la clínica
> o por imágenes con licencia comercial. Basta con sobrescribir los archivos y subir
> `VERSION_FOTOS`.

Las ilustraciones de los ocho servicios son dibujos vectoriales hechos para el sitio: pesan
menos de 1 KB cada uno y se ven nítidos en cualquier pantalla.

---

## 5. Datos de ejemplo y pendientes

**Equipo (datos de ejemplo).** Los cuatro integrantes que aparecen —nombres, especialidades
y años de experiencia— **son inventados para esta versión de presentación interna**, sobre
fotografías del material que entregó la clínica. La propia sección lo advierte al pie.

| Perfil (ejemplo) | Foto | Archivo |
|---|---|---|
| Dra. Valeria Ospina Arboleda | odontóloga frente al manifiesto | `equipo-2.jpg` |
| Dr. Mateo Restrepo Salazar | odontólogo en el consultorio | `equipo-3.jpg` |
| Dra. Camila Herrera Lozano | retrato en el consultorio | `equipo-4.jpg` |
| Laura Marcela Caicedo | retrato en la recepción | `equipo-5.jpg` |

Para reemplazarlos por los reales:

1. Cambia el texto en `assets/js/i18n.js`, claves `equipo.1.*` … `equipo.4.*` (en español y
   en inglés).
2. Sobrescribe la fotografía en `assets/img/fotos/` (`equipo-2.jpg` … `equipo-5.jpg`).
3. Sube `VERSION_FOTOS` en `assets/js/app.js`.

**Pendientes reales:**

1. **Nombres y fotos reales del equipo** antes de cualquier publicación al público.
2. **Envío automático de las fotos del paciente.** Hoy la página prepara el mensaje y el
   paciente adjunta las imágenes en WhatsApp o en el correo. Para que lleguen solas a
   highsmilecali@gmail.com hace falta un servicio de formularios o un backend propio.
3. **Textos.** La redacción es una propuesta; conviene que la clínica la revise, sobre todo
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
