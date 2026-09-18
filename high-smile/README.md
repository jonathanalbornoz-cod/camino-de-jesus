# High Smile · Clínica Odontológica (Cali) — sitio web

Sitio web en **español e inglés** para High Smile Clínica Odontológica, en Santiago de Cali.
Portada horizontal a pantalla completa, paleta **negro dominante, blanco y gris**, y el
logotipo oficial de la clínica.

> **Versión de muestra, en un dominio de pruebas.** Mientras el sitio viva en
> `injoepropuesta2.online` y no en el dominio definitivo de la clínica, las tres páginas van
> con `noindex`, y `robots.txt` y `.htaccess` piden lo mismo: así Google no indexa una
> dirección provisional ni la deja compitiendo con la definitiva. Los pasos para quitar esos
> candados están al final de `DESPLIEGUE-HOSTINGER.md`.

---

## 1. Datos de la clínica usados en el sitio

| Dato | Valor |
|---|---|
| Nombre | High Smile Clínica Odontológica |
| Dirección | Calle 14 #84a-05, Edificio Benessere, consultorio 310 · Santiago de Cali |
| WhatsApp y teléfono | +57 300 523 9827 (un solo número para las dos cosas) |
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
| Portada | Fotografía del equipo en el mirador de Cali a pantalla completa, logotipo, eslogan y accesos a agenda y WhatsApp |
| Banda | Franja de imagen a ancho completo bajo la portada, deslizable con el ratón, el dedo o las flechas |
| Servicios | Las ocho especialidades, cada una con su ilustración propia |
| Reseña clínica | Quiénes son, método de trabajo y carrusel de fotos de la clínica |
| Casos de éxito | Carrusel de antes y después (`caso-1` … `caso-6`, cada diapositiva monta las dos fotos del caso) |
| Antes y después | Carrusel con los pacientes que terminaron su tratamiento |
| Nuestro equipo | Cinco perfiles con fotografía, nombre y especialidad |
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
| `assets/fonts/` | Las dos tipografías del sitio, con sus licencias |
| `_headers` | Cabeceras de seguridad para Netlify y Cloudflare Pages |
| `.htaccess` | Lo mismo para Hostinger y cualquier Apache o LiteSpeed |
| `robots.txt` | Pide a los buscadores que no indexen esta versión de muestra |
| `DESPLIEGUE-HOSTINGER.md` | Guía paso a paso para publicar en Hostinger |

Sin frameworks, sin `npm install`, sin dependencias externas: HTML, CSS y JavaScript puro.

### Tipografía

| Uso | Fuente |
|---|---|
| Títulos, rótulos, menú y botones | **Jost** (geométrica, en pesos 200–400) |
| Texto corrido, formularios y datos | **Inter** |

Las dos van **alojadas en este mismo repositorio**, en `assets/fonts/`. No se piden a Google
ni a ningún otro servidor: la página sigue sin contactar a terceros y la regla `font-src
'self'` de la CSP se mantiene tal cual. Son archivos variables —un solo archivo cubre de
peso 200 a 700— con el subconjunto latino, que es todo lo que necesitan el español y el
inglés: **73 KB entre las dos** (26 KB Jost + 48 KB Inter). Ambas están bajo la SIL Open Font
License; el texto de la licencia acompaña a cada una en esa misma carpeta.

Para cambiarlas basta con reemplazar los dos `.woff2` y editar las variables `--fuente` y
`--fuente-titulos` al principio de `assets/css/estilos.css`. Si un archivo no cargara, el
texto cae en la tipografía del sistema y la página sigue viéndose bien.

---

## 4. Fotografías

Las fotos que envió la clínica están reducidas para web (las originales pesaban entre 1,4 y
3,7 MB cada una; ahora ninguna pasa de 165 KB). Para agregar o reemplazar fotos, todo está
explicado en `assets/img/fotos/LEEME.md`: basta con copiarlas en esa carpeta con el nombre
que corresponde y la página las publica sola.

La portada usa **dos recortes de la misma fotografía**: `hero.jpg` (horizontal, para
computador y tablet) y `hero-movil.jpg` (vertical, para pantallas de hasta 700 px). El
navegador elige una u otra con un `<picture>`; en el teléfono el encuadre ancho dejaría a
las personas fuera del cuadro.

El velo oscuro que va encima está calibrado midiendo el contraste real de cada bloque de
texto sobre la fotografía: en el peor punto, el titular queda en 6,9 : 1 y los textos
pequeños en 5,6 : 1 o más, por encima del 4,5 : 1 que pide la norma de accesibilidad AA.
Si se cambia la fotografía por una más clara, hay que volver a comprobarlo.

> La fotografía muestra a dos personas identificables. Antes de publicar el sitio conviene
> tener su autorización por escrito para usar su imagen, igual que con las fotos del equipo.

Las tres imágenes de turismo dental son fotografías propias del equipo en la ciudad —el
mirador de Belalcázar, el Gato del Río y una de las Gatas del Río— en `cali-1.jpg`,
`cali-2.jpg` y `cali-3.jpg`, a 900 × 1200 px. Son verticales, y por eso la tarjeta de la
ciudad usa proporción 3 : 4: en apaisado habría que cortar o el monumento o a las personas.

Las ilustraciones de los ocho servicios son dibujos vectoriales hechos para el sitio: pesan
menos de 1 KB cada uno y se ven nítidos en cualquier pantalla.

---

## 5. Equipo y pendientes

Los cinco perfiles son los profesionales reales de la clínica, con su nombre y su
especialidad. No se publican años de experiencia.

| Perfil | Especialidad | Foto |
|---|---|---|
| Paola Andrea Cortés Montes | CEO y gerente | `equipo-2.jpg` |
| Dr. Edward Sanchez | CEO · Implantología y rehabilitación oral | `equipo-3.jpg` |
| Dra. Claudia Ramírez | Ortodoncia | `equipo-4.jpg` |
| Dra. Carolina Silva Puentes | Odontopediatría y ortopedia maxilar | `equipo-5.jpg` |
| Dr. Andrés Felipe Limas Martínez | Endodoncia | `equipo-6.jpg` |

> **Los cinco retratos están generados con inteligencia artificial**, no son fotografías.
> Se hicieron así para que la sección quedara uniforme: mismo consultorio, mismo uniforme y
> misma luz en los cinco. Conviene que cada persona vea su retrato y dé el visto bueno antes
> de publicar, porque representa su imagen aunque no sea una foto suya.
>
> **Por confirmar:** llegaron sin decir cuál correspondía a cada quien. Se asignaron por
> parecido con las fotografías anteriores, y los dos retratos de mujer rubia —`equipo-2.jpg`
> para la gerente y `equipo-5.jpg` para la odontopediatra— son los que más conviene revisar.
> Si están cambiados, basta con intercambiar los dos archivos y subir `VERSION_FOTOS`.

Para cambiar un perfil: el texto está en `assets/js/i18n.js`, claves `equipo.1.*` …
`equipo.5.*` (en español y en inglés); la fotografía, en `assets/img/fotos/equipo-N.jpg`.
Después sube `VERSION_FOTOS` en `assets/js/app.js`. Añadir un sexto perfil es copiar una
tarjeta en `index.html`, crear sus tres claves y ajustar `.rejilla--5` en el CSS.

**Pendientes:**

1. **Autorización de imagen.** Las fotografías de la portada, de la clínica y de turismo
   dental muestran a personas identificables, y los cinco retratos del equipo representan a
   profesionales concretos: conviene tener su permiso por escrito antes de publicar el sitio.
   Los casos de éxito son, además, **fotografía clínica de pacientes reconocibles**: ese
   consentimiento debe ser específico para uso publicitario y conviene conservarlo firmado.
   `paciente-6.jpg` muestra a **una menor de edad**, así que su autorización la firman el
   padre, la madre o quien tenga su representación legal.
2. **Caso 6 (`caso-6.jpg`).** Sus dos fotografías son del resultado, no un antes y un
   después: la diapositiva muestra dos vistas del mismo resultado y su texto alternativo lo
   dice así. Si aparece la fotografía previa, basta recomponer la diapositiva.
3. **Envío automático de las fotos del paciente.** Hoy la página prepara el mensaje y el
   paciente adjunta las imágenes en WhatsApp o en el correo. Para que lleguen solas a
   highsmilecali@gmail.com hace falta un servicio de formularios o un backend propio.
4. **Textos.** La redacción es una propuesta; conviene que la clínica la revise, sobre todo
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

**Hostinger:** todo el proceso está en [`DESPLIEGUE-HOSTINGER.md`](DESPLIEGUE-HOSTINGER.md).
En resumen: vaciar `public_html`, subir el contenido de esta carpeta y activar el SSL. Las
rutas del sitio son relativas, así que funciona igual en la raíz de un dominio que dentro de
una subcarpeta, sin tocar nada.

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
- **Texto justificado** en los bloques de texto corrido —la reseña clínica, las respuestas
  de preguntas frecuentes, los avisos y la política de privacidad—, con partición de palabras
  según el idioma del documento. Los textos centrados y los de tarjeta se quedan a bandera
  izquierda: en columna estrecha la justificación abre más huecos de los que arregla. Por
  debajo de 600 px se desactiva por el mismo motivo. La clase es `.justificado`.
- HTML semántico y accesible: `aria-*`, roles, foco visible, navegación por teclado,
  carruseles manejables con el teclado y respeto por `prefers-reduced-motion`.
