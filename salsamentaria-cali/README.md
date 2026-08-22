# 🥩 Salsamentaría La Sazón Caleña — sitio web de ejemplo

Sitio web de demostración para una **salsamentaría ubicada en Cali (Valle del Cauca)**,
barrio Tequendama. Está hecho con HTML, CSS y JavaScript puros: no necesita servidor,
ni instalación, ni dependencias.

> ⚠️ **Todo el contenido es ficticio** (nombre, dirección, teléfonos, correo, precios y
> horarios) y se usa únicamente como ejemplo de diseño.

## Páginas

| Archivo | Qué contiene |
|---|---|
| `index.html` | Portada: vitrina de productos con filtros, calculadora “Armá tu bandeja”, testimonios, horarios, cómo llegar y preguntas frecuentes. |
| `contacto.html` | **Landing de contacto y agendamiento**: canales directos (WhatsApp, teléfono, correo, dirección), formulario de citas con validación y lista de “Mis citas guardadas”. |
| `privacidad.html` | Política de privacidad y tratamiento de datos personales (Ley 1581 de 2012). |

```
salsamentaria-cali/
├── index.html
├── contacto.html
├── privacidad.html
└── assets/
    ├── css/estilos.css
    └── js/
        ├── comun.js     → utilidades compartidas, horario, menú, almacenamiento
        ├── inicio.js    → productos, filtros y calculadora de bandeja
        └── agenda.js    → formulario de citas, validación y citas guardadas
```

## Cómo verlo

- **En línea (GitHub Pages):** activá *Settings → Pages → Deploy from a branch* y quedará en
  `https://<usuario>.github.io/<repositorio>/salsamentaria-cali/`.
- **En tu computador:** abrí `index.html` con doble clic, o levantá un servidor local con
  `python3 -m http.server` y entrá a `http://localhost:8000/salsamentaria-cali/`.

## Datos del negocio (ficticios)

- 📍 Calle 9 # 44-15, local 2 · Barrio Tequendama, Cali
- 📞 (602) 555 0142 · 💬 WhatsApp 315 555 0198 · ✉️ hola@lasazoncalena.co
- 🕒 Lunes a jueves 7:00 a.m.–8:00 p.m. · Viernes y sábado 7:00 a.m.–9:00 p.m. · Domingos y festivos 8:00 a.m.–2:00 p.m.

## Facilidad de contacto

El contacto aparece en cinco lugares distintos para que nunca haya que buscarlo:
barra superior fija, tarjeta de la portada, botón flotante de WhatsApp, tarjetas de la
landing de contacto y pie de página.

## Agendamiento

En `contacto.html`, el formulario:

- muestra **solo las horas disponibles** según el horario real de cada día;
- exige **2 horas de anticipación** y permite agendar hasta **60 días** adelante;
- valida nombre, teléfono, correo, fecha, hora, cantidad de personas y barrio, con mensajes
  claros junto a cada campo;
- genera un **código de reserva** (por ejemplo `SC-K7QP2`) y arma un mensaje de WhatsApp listo
  para confirmar;
- guarda la cita para poder consultarla o cancelarla después.

## Seguridad y privacidad

- **Content Security Policy estricta** en las tres páginas: `default-src 'self'`, sin scripts ni
  estilos en línea, `form-action 'none'`, `frame-ancestors 'none'`, `object-src 'none'` y
  `base-uri 'none'`.
- **Cero recursos externos**: ni fuentes, ni mapas, ni analítica, ni cookies de rastreo. El mapa
  de “cómo llegar” es un SVG dibujado a mano dentro del propio sitio.
- **Sin `innerHTML` con datos dinámicos**: todo se pinta con `textContent`, lo que evita XSS.
- **Validación y saneamiento** de cada campo: longitud máxima, formato y eliminación de
  caracteres de control.
- **Minimización de datos**: la cita guardada conserva el nombre, el servicio, la fecha, la hora
  y el número de personas; el teléfono se guarda **enmascarado** y el correo y las notas **no se
  guardan**.
- **Datos solo en tu dispositivo**: se usa `localStorage` (envuelto en `try/catch`) y hay un botón
  para borrarlo todo cuando quieras.
- **Consentimiento explícito** antes de registrar la cita, con enlace a la política de privacidad.
- **Enlaces externos** con `rel="noopener noreferrer"` y `<meta name="referrer" content="no-referrer">`.

## Convenciones de código

- `const` por defecto; `let` solo donde la variable realmente se reasigna
  (los contadores de los bucles de horas y el acumulado del total).
- `'use strict'` y módulos encapsulados en IIFE, sin variables globales sueltas más allá de
  `Salsa`, el objeto de utilidades compartidas.
- Nombres, comentarios y textos de interfaz en español.

## Accesibilidad y experiencia de usuario

Enlace “saltar al contenido”, foco visible, etiquetas asociadas a cada campo, mensajes de error
anunciados con `aria-live`, contraste alto (rojo `#c1121f`, blanco y texto negro), diseño
responsive, menú para móviles y respeto por `prefers-reduced-motion`.
