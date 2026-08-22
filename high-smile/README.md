# High Smile · Clínica Odontológica (Cali) — sitio web

Sitio web en **español e inglés** para High Smile Clínica Odontológica, en Santiago de Cali.
Diseño minimalista y corporativo con paleta **negro dominante, blanco y gris**, según el
brief entregado por la clínica.

---

## 1. Datos de la clínica usados en el sitio

| Dato | Valor |
|---|---|
| Nombre | High Smile Clínica Odontológica |
| Dirección | Calle 14 #84a-05, Edificio Benessere, consultorio 310 · Santiago de Cali |
| WhatsApp | +57 315 825 3729 |
| Teléfono | +57 300 523 9827 |
| Correo | highsmilecali@gmail.com |
| Instagram | [@highsmile_co](https://www.instagram.com/highsmile_co/) |
| Facebook | [High Smile Clínica Odontológica](https://www.facebook.com/people/High-Smile-Cl%C3%ADnica-Odontol%C3%B3gica/61579892912629/) |
| Eslogan | Cuidamos tu sonrisa con detalle y confianza |
| Especialidades | Ortodoncia · Periodoncia · Implantología oral · Rehabilitación oral · Cirugía oral y maxilofacial · Endodoncia · Diseño de sonrisa · Limpieza dental |
| Trayectoria | 10 años de experiencia · más de 3.000 pacientes |

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

## 3. Fotos e imágenes

Las imágenes que envió la clínica ya están en el sitio:

| Archivo | Qué muestra | Dónde aparece |
|---|---|---|
| `clinica.jpg` | El equipo frente al logo de la clínica | Imagen principal del inicio |
| `consultorio.jpg` | Odontólogo durante un tratamiento | Sección «La clínica» |
| `galeria-1.jpg` | Sonrisa natural después del tratamiento | Galería |
| `galeria-2.jpg` | Antes y después «Natural y sana» | Galería |
| `galeria-3.jpg` | Paciente infantil en el consultorio | Galería |
| `galeria-4.jpg` | Pieza «Transforma tu sonrisa» | Galería |
| `galeria-5.jpg` | Banner de especialidades y experiencia | Galería |
| `galeria-6.jpg` | Pieza «Sonríe con alegría colombiana» | Galería |

**Para agregar más fotos:** cópialas en `assets/img/galeria/` como `galeria-7.jpg`,
`galeria-8.jpg`… hasta `galeria-24.jpg`. La galería se arma sola con los archivos que
existan y no hay que tocar el HTML; se puede hacer desde la web de GitHub con
**Add file → Upload files**. Numéralas seguidas: el recorrido se detiene tras tres números
consecutivos sin archivo, para no pedir imágenes inexistentes. Los tamaños recomendados y
cómo escribir el texto alternativo están en `assets/img/galeria/LEEME.md`.

La galería es un mosaico por columnas: cada imagen conserva su proporción original, así
que conviven publicaciones verticales de Instagram, banners horizontales y fotos cuadradas
sin recortes.

---

## 4. Pendientes para la clínica

1. **Confirmar el número principal.** El brief traía el 315 825 3729 y las piezas gráficas
   el 300 523 9827. Hoy el sitio usa **315 825 3729 para los enlaces de WhatsApp** y muestra
   el 300 523 9827 como teléfono. Si debe ser al revés, es un cambio de un minuto.
2. **Horario.** El sitio dice «atención con cita previa» porque no había horarios en el
   material. En cuanto los envíen se agregan a la barra superior, a contacto y a la agenda.
3. **Textos.** La redacción es una propuesta a partir del brief y de las piezas gráficas;
   conviene que la clínica la revise, sobre todo la política de privacidad.
4. **Logotipo.** El de `assets/img/logo.svg` es una reconstrucción del monograma en SVG. Si
   tienen el original vectorial, reemplácenlo.

---

## 5. Idiomas

El selector **ES / EN** está en la cabecera de las tres páginas.

- Todos los textos viven en `assets/js/i18n.js`, en dos diccionarios con las mismas claves.
- Se traducen también el `<title>`, la meta descripción, los textos del formulario y las
  etiquetas del resumen de la cita.
- La elección se guarda en el navegador del visitante; si nunca ha elegido, se usa el idioma
  de su navegador (inglés si empieza por `en`, español en el resto de casos).

Para cambiar un texto: busca su clave (por ejemplo `hero.titulo1`) en `i18n.js` y edítala en
`es` y en `en`.

---

## 6. Mapa

La sección **Ubicación** muestra el mapa de Google centrado en la dirección de la clínica,
pero **no lo carga hasta que el visitante pulsa «Cargar el mapa»**: así ningún tercero recibe
datos de quien solo está mirando la página. Junto al mapa quedan los botones «Abrir en Google
Maps» y «Cómo llegar».

Si la clínica quiere el pin exactamente sobre la puerta, envíen las coordenadas y se cambia la
URL en el atributo `data-mapa-url` de `index.html`.

---

## 7. Cómo verlo

**Servidor local** (recomendado):

```bash
cd high-smile
python3 -m http.server 8080
# abrir http://localhost:8080
```

**GitHub Pages:** con Pages configurado sobre esta rama y carpeta `/ (root)`, el sitio queda en
`https://<usuario>.github.io/camino-de-jesus/high-smile/`

---

## 8. Seguridad y privacidad

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

## 9. Convenciones de código

- **`const` por defecto, `let` solo por excepción:** en todo el JavaScript hay dos `let`
  (`pasoActual` en el formulario e `idiomaActual` en el traductor), los únicos valores que
  se reasignan.
- Modo estricto (`'use strict'`) e IIFE para no contaminar el ámbito global.
- Sin atributos `style=` en el HTML: todo va en clases, para poder mantener
  `style-src 'self'` sin `unsafe-inline`.
- HTML semántico y accesible: `aria-*`, roles, foco visible, salto al contenido, navegación
  por teclado y respeto por `prefers-reduced-motion`.
