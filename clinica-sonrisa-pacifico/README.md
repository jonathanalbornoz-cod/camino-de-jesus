# Sonrisa Pacífico · Clínica Odontológica en Cali (sitio de ejemplo)

Sitio web de demostración para una clínica odontológica ubicada en **Cali, Valle del Cauca
(Colombia)**, inspirado en la estructura de sitios del sector como Odontología Ciudad Jardín,
pero con una identidad propia más cálida, más clara y más fácil de usar.

> **Aviso:** la clínica, los profesionales, los teléfonos, las direcciones exactas y los precios
> son **ficticios**. Es un ejemplo de diseño y desarrollo, no un negocio real.

---

## 1. Qué incluye

| Archivo | Descripción |
|---|---|
| `index.html` | Landing principal: héroe, horarios en vivo, servicios, proceso, equipo, testimonios, preguntas frecuentes y contacto. |
| `agenda.html` | **Landing de contacto y registro de citas**: accesos directos (WhatsApp, teléfono, correo) y formulario guiado en 3 pasos con confirmación. |
| `privacidad.html` | Política de privacidad y habeas data (Ley 1581 de 2012 de Colombia). |
| `assets/css/estilos.css` | Diseño completo: variables de color, componentes, responsive, modo impresión y respeto por `prefers-reduced-motion`. |
| `assets/js/app.js` | Menú móvil, acordeón de preguntas, testimonios rotativos, animaciones y estado «Abierto / Cerrado» según la hora real de Cali. |
| `assets/js/agenda.js` | Formulario por pasos, validaciones, resumen, código de solicitud y borrado de datos locales. |
| `_headers` | Cabeceras de seguridad para hostings que las permiten (Netlify, Cloudflare Pages). |

Sin frameworks, sin `npm install`, sin dependencias externas: HTML, CSS y JavaScript puro.

---

## 2. Cómo verlo

**Opción rápida:** abrir `index.html` con doble clic en el navegador.

**Con un servidor local** (recomendado, respeta las rutas y la CSP):

```bash
cd clinica-sonrisa-pacifico
python3 -m http.server 8080
# abrir http://localhost:8080
```

**Publicarlo en GitHub Pages** (para mostrárselo a alguien con un enlace):

1. En GitHub, entra al repositorio → **Settings** → **Pages**.
2. En *Build and deployment* elige **Deploy from a branch**.
3. Branch: `claude/dental-clinic-cali-website-srtkct` (o `main` si ya se fusionó), carpeta `/ (root)`.
4. Guarda y espera 1–2 minutos. El sitio quedará en:
   `https://<usuario>.github.io/camino-de-jesus/clinica-sonrisa-pacifico/`

---

## 3. Contacto y agendamiento (lo que pidió el negocio)

El contacto está siempre a la vista:

- Barra superior con dirección, horario y teléfono en todas las pantallas.
- Botón **«Agendar cita»** fijo en la cabecera.
- Botón flotante de WhatsApp en la esquina inferior derecha.
- Sección de contacto con los cinco canales y el horario completo.
- Landing dedicada `agenda.html` con tres atajos (WhatsApp, llamada, correo) antes del formulario.

El formulario funciona en **3 pasos** para no abrumar: *tus datos → tu cita → confirmación*.
Al enviarlo se genera un código de solicitud (por ejemplo `SP-KD7M2X`) y se ofrece enviar el
mismo resumen por WhatsApp con un clic.

### Datos de la clínica (ficticios)

- **Sede principal:** Carrera 105 # 15-45, Ciudad Jardín, Cali.
- **Sede norte:** Avenida 6N # 25-30, Barrio Granada, Cali.
- **Teléfono:** (602) 555 7788 · **WhatsApp:** +57 318 555 4477
- **Correo:** hola@sonrisapacifico.co
- **Horario:** lunes a viernes 7:00 a.m. – 7:00 p.m. · sábados 8:00 a.m. – 2:00 p.m. ·
  domingos y festivos cerrado · urgencias 24/7.

---

## 4. Seguridad y privacidad

- **Content Security Policy** restrictiva declarada por `<meta http-equiv>` en cada página y en
  `_headers` para los hostings que soportan cabeceras.
- **Cero recursos de terceros:** no hay Google Fonts, CDNs, mapas incrustados, analítica ni
  pixeles de redes sociales. Nadie más ve la visita del paciente.
- **Cero cookies**, por lo tanto ningún banner de cookies.
- **Minimización de datos:** solo nombre, celular, motivo y preferencia de horario.
- **Sin `innerHTML`:** todo lo que escribe el usuario se pinta con `textContent`, así que no es
  posible inyectar HTML ni scripts (XSS).
- **Validación** de cada campo (nombre, celular colombiano, correo, fecha hábil no pasada) antes
  de aceptar la solicitud.
- **Consentimiento explícito** de habeas data antes de enviar, con enlace a la política.
- **Almacenamiento local opcional** (`localStorage`), solo si el paciente lo marca, envuelto en
  `try/catch` y con un botón para borrarlo.
- **Enlaces externos** con `target="_blank"` siempre acompañados de `rel="noopener noreferrer"`.
- **Código aleatorio de solicitud** generado con `crypto.getRandomValues()`, sin datos personales.

> En una implementación real, el formulario debe enviarse a un backend propio con HTTPS,
> protección CSRF, límite de intentos (*rate limiting*) y almacenamiento cifrado. Esta demo no
> transmite datos a ningún servidor.

---

## 5. Convenciones de código

- **`const` por defecto, `let` solo por excepción**: en todo el JavaScript hay 110 `const` y solo
  tres `let` (`pasoActual`, `indiceActual` y `temporizador`), los únicos valores que de verdad se
  reasignan.
- Modo estricto (`'use strict'`) e IIFE para no contaminar el ámbito global.
- Nombres, comentarios y textos en español.
- HTML semántico y accesible: `aria-*`, roles, foco visible, salto al contenido, contraste alto,
  soporte de teclado y respeto por `prefers-reduced-motion`.

---

## 6. Ideas para la siguiente versión

- Calendario con disponibilidad real conectado a la agenda de la clínica.
- Recordatorios automáticos por WhatsApp 24 horas antes.
- Portal del paciente con historial de tratamientos y pagos.
- Versión en inglés para pacientes de turismo dental.
