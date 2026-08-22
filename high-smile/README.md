# High Smile · Clínica Odontológica (Cali) — sitio web

Sitio web en **español e inglés** para High Smile Clínica Odontológica, en Santiago de Cali.
Diseño minimalista y corporativo con paleta **negro dominante, blanco y gris**, según el
brief entregado por la clínica.

---

## 1. Datos de la clínica usados en el sitio

| Dato | Valor |
|---|---|
| Nombre | High Smile Clínica Odontológica |
| Dirección | Calle 14 #84a-05, Santiago de Cali, Valle del Cauca, Colombia |
| WhatsApp / teléfono | +57 315 825 3729 |
| Correo | highsmilecali@gmail.com |
| Instagram | [@highsmile_co](https://www.instagram.com/highsmile_co/) |
| Facebook | [High Smile Clínica Odontológica](https://www.facebook.com/people/High-Smile-Cl%C3%ADnica-Odontol%C3%B3gica/61579892912629/) |
| Eslogan | Cuidamos tu sonrisa con detalle y confianza |
| Especialidades | Ortodoncia · Periodoncia · Implantes · Diseño de sonrisa |

---

## 2. Archivos

| Archivo | Descripción |
|---|---|
| `index.html` | Página principal: héroe, servicios, la clínica, proceso, galería, ubicación con mapa, preguntas frecuentes y contacto. |
| `agenda.html` | Landing de contacto y agendamiento: accesos directos (WhatsApp, llamada, correo) y formulario en 3 pasos. |
| `privacidad.html` | Política de privacidad y habeas data (Ley 1581 de 2012). |
| `assets/css/estilos.css` | Diseño completo: paleta, componentes, responsive, impresión y `prefers-reduced-motion`. |
| `assets/js/i18n.js` | Traducción español/inglés: motor + los dos diccionarios completos. |
| `assets/js/app.js` | Menú, acordeón, animaciones, carga de fotos y mapa bajo consentimiento. |
| `assets/js/agenda.js` | Formulario por pasos, validaciones, resumen y borrado de datos locales. |
| `assets/img/` | Logotipo, favicon y carpeta `galeria/` para las fotos. |
| `_headers` | Cabeceras de seguridad para hostings que las permiten. |

Sin frameworks, sin `npm install`, sin dependencias externas: HTML, CSS y JavaScript puro.

---

## 3. Pendientes para la clínica

1. **Fotos.** Ver `assets/img/galeria/LEEME.md`: basta copiar las imágenes con el nombre
   indicado y aparecen solas, sin tocar el código. Mientras no existan, se ve un marco con
   un icono (y la consola del navegador registra un 404 por cada intento: es lo esperado).
2. **Horario.** El sitio dice «atención con cita previa» porque el brief no traía horarios.
   En cuanto los envíen se agregan al pie, a la barra superior y al panel de la agenda.
3. **Textos.** La redacción es una propuesta a partir del brief; conviene que la clínica la
   revise, sobre todo la política de privacidad antes de publicarla.
4. **Logotipo.** El de `assets/img/logo.svg` es una reconstrucción del monograma en SVG
   (se ve nítido a cualquier tamaño). Si tienen el original vectorial, reemplácenlo.

---

## 4. Idiomas

El selector **ES / EN** está en la cabecera de las tres páginas.

- Todos los textos viven en `assets/js/i18n.js`, en dos diccionarios con las mismas claves.
- Se traducen también el `<title>`, la meta descripción, los textos del formulario y las
  etiquetas del resumen de la cita.
- La elección se guarda en el navegador del visitante; si nunca ha elegido, se usa el idioma
  de su navegador (inglés si empieza por `en`, español en el resto de casos).

Para cambiar un texto: busca su clave (por ejemplo `hero.titulo1`) en `i18n.js` y edítala en
`es` y en `en`.

---

## 5. Mapa

La sección **Ubicación** muestra el mapa de Google centrado en la dirección de la clínica,
pero **no lo carga hasta que el visitante pulsa «Cargar el mapa»**: así ningún tercero recibe
datos de quien solo está mirando la página. Junto al mapa quedan los botones «Abrir en Google
Maps» y «Cómo llegar».

Si la clínica quiere el pin exactamente sobre la puerta, envíen las coordenadas y se cambia la
URL en el atributo `data-mapa-url` de `index.html`.

---

## 6. Cómo verlo

**Servidor local** (recomendado):

```bash
cd high-smile
python3 -m http.server 8080
# abrir http://localhost:8080
```

**GitHub Pages:** con Pages configurado sobre esta rama y carpeta `/ (root)`, el sitio queda en
`https://<usuario>.github.io/camino-de-jesus/high-smile/`

---

## 7. Seguridad y privacidad

- **Content Security Policy** restrictiva en cada página y en `_headers`. La única excepción es
  `frame-src` para el mapa, y solo se usa tras el consentimiento del visitante.
- **Cero recursos de terceros** al cargar: sin Google Fonts, sin CDNs, sin analítica y sin
  pixeles de redes sociales (verificado: la página no hace ninguna petición externa hasta que
  se pulsa «Cargar el mapa»).
- **Cero cookies**, por lo tanto ningún banner de cookies.
- **Minimización de datos:** nombre, celular, motivo y preferencia de horario.
- **Sin `innerHTML`:** lo que escribe el paciente se pinta con `textContent`, lo que impide
  inyecciones de HTML o scripts (XSS).
- **Validación** de cada campo (nombre, celular colombiano, correo, fecha hábil no pasada).
- **Consentimiento explícito** de habeas data antes de enviar.
- **Almacenamiento local opcional** y con botón para borrarlo.
- **Enlaces externos** siempre con `rel="noopener noreferrer"`.
- **Código de solicitud** generado con `crypto.getRandomValues()`, sin datos personales.

> El formulario no envía datos a ningún servidor: prepara el resumen y lo entrega por WhatsApp.
> Para recibir las solicitudes por correo hace falta conectar un backend propio con HTTPS,
> protección CSRF y límite de intentos.

---

## 8. Convenciones de código

- **`const` por defecto, `let` solo por excepción:** en todo el JavaScript hay dos `let`
  (`pasoActual` en el formulario e `idiomaActual` en el traductor), los únicos valores que
  se reasignan.
- Modo estricto (`'use strict'`) e IIFE para no contaminar el ámbito global.
- Sin atributos `style=` en el HTML: todo va en clases, para poder mantener
  `style-src 'self'` sin `unsafe-inline`.
- HTML semántico y accesible: `aria-*`, roles, foco visible, salto al contenido, navegación
  por teclado y respeto por `prefers-reduced-motion`.
