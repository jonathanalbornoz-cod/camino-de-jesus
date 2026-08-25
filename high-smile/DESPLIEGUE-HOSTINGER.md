# Publicar el sitio en Hostinger · injoepropuesta2.online

Guía para pasar esta página al hosting de Hostinger. Son unos 15 minutos.
No hace falta saber programar: todo se hace desde el hPanel.

---

## Antes de empezar: haz una copia de lo que ya está publicado

El dominio ya tiene una página con datos dentro y el paso 2 los borra **sin
posibilidad de recuperarlos**. Aunque no los necesites, guarda una copia por si acaso:

1. Entra a **hPanel → Archivos → Administrador de archivos**.
2. Abre la carpeta `public_html`.
3. Selecciona todo (Ctrl + A), pulsa el botón de **comprimir** y descarga el `.zip`
   que se genera.
4. Guárdalo en tu computador con la fecha en el nombre, por ejemplo
   `respaldo-injoepropuesta2-2026-08-25.zip`.

Si esa página tenía una base de datos (WordPress, por ejemplo), respáldala también
desde **hPanel → Bases de datos → phpMyAdmin → Exportar**. Este sitio no usa ninguna,
así que después puedes eliminarla; pero primero guárdala.

---

## 1. Prepara el archivo que vas a subir

Necesitas el paquete `high-smile-hostinger.zip`. Trae el sitio completo y ya listo:
las tres páginas, las fotos, las fuentes, el `.htaccess` con las cabeceras de
seguridad y el `robots.txt`.

Si prefieres armarlo tú desde este repositorio, comprime **el contenido** de la
carpeta `high-smile/` —no la carpeta en sí— y deja fuera `README.md`, `_headers`,
`.nojekyll` y este mismo archivo: son de trabajo interno y no hacen falta en el
servidor. Al abrir el zip, `index.html` tiene que estar en la primera pantalla, no
dentro de otra carpeta.

---

## 2. Vacía `public_html`

1. **hPanel → Archivos → Administrador de archivos**.
2. Entra a `public_html`.
3. Selecciona **todo**, incluidos los archivos ocultos: pulsa el icono del **ojo** o
   **Configuración → Mostrar archivos ocultos** para que aparezcan los que empiezan
   por punto, como `.htaccess`.
4. Bórralo todo.

> Borra lo que hay **dentro** de `public_html`, no la carpeta `public_html`.

---

## 3. Sube el sitio

1. Dentro de `public_html`, pulsa **Subir archivos** y elige `high-smile-hostinger.zip`.
2. Cuando termine, haz clic derecho sobre el zip → **Extraer** (o el icono de
   extraer), y confirma que se extrae en `public_html`.
3. Borra el `.zip` del servidor: ya no sirve para nada.

Al final, `public_html` debe verse así:

```
public_html/
├── index.html
├── agenda.html
├── privacidad.html
├── robots.txt
├── .htaccess
└── assets/
    ├── css/    js/    fonts/
    └── img/    (fotos, ilustraciones, logotipos)
```

Si `index.html` quedó dentro de una subcarpeta, muévelo todo un nivel hacia arriba:
la página no abrirá si no está en la raíz.

---

## 4. Activa el certificado SSL

**hPanel → Seguridad → SSL**, y activa el certificado gratuito para
`injoepropuesta2.online`. Puede tardar unos minutos en emitirse.

El `.htaccess` que va incluido **obliga a usar https**. Si abres la página antes de
que el certificado esté listo, el navegador dará error: espera a que aparezca como
activo y vuelve a intentarlo.

---

## 5. Comprueba que quedó bien

Abre `https://injoepropuesta2.online` y revisa:

- [ ] Se ve la portada con la foto de fondo y el logotipo.
- [ ] Sale el **candado** en la barra del navegador.
- [ ] El menú **CONTACTO** abre el panel con Turismo dental y Valoración a distancia.
- [ ] Las fotos de la clínica, de los casos y del equipo cargan todas.
- [ ] Los títulos se ven con la letra fina y redonda (Jost). Si se vieran con la
      letra de siempre del sistema, falta la carpeta `assets/fonts/`.
- [ ] El botón **EN** traduce la página al inglés.
- [ ] El mapa de Google aparece en la sección de contacto.
- [ ] `https://injoepropuesta2.online/agenda.html` abre el formulario y lo deja
      avanzar por los tres pasos.

Si algo no se ve, casi siempre es el navegador mostrando lo que tenía guardado:
pulsa **Ctrl + Shift + R** (o Cmd + Shift + R en Mac).

---

## 6. Para actualizar la página más adelante

Cambiar un texto, una foto o un nombre no obliga a repetir todo esto: sube solo el
archivo que cambió, al mismo sitio y con el mismo nombre.

- **Un texto** → `assets/js/i18n.js` (recuerda cambiarlo en español y en inglés).
- **Una foto** → cópiala en `assets/img/fotos/` con el nombre que corresponde y sube
  el número `VERSION_FOTOS` en `assets/js/app.js`, si no, quien ya entró seguirá
  viendo la anterior. Todo está explicado en `assets/img/fotos/LEEME.md`.
- **Un color o un tamaño** → `assets/css/estilos.css`.

---

## Antes de que la página sea pública de verdad

Esta versión es una **muestra para presentación interna** y va marcada como tal:

- Las tres páginas llevan `<meta name="robots" content="noindex, nofollow">`.
- `robots.txt` pide a los buscadores que no la recorran.
- El `.htaccess` envía la cabecera `X-Robots-Tag: noindex, nofollow`.

Son tres candados para que **Google no muestre en sus resultados nombres de
profesionales que hoy son inventados**, asociados a una clínica real. Cuando la
clínica confirme los nombres, los cargos y las fotos verdaderas, hay que:

1. Reemplazar esos datos (claves `equipo.*` en `assets/js/i18n.js` y las fotos
   `equipo-*.jpg`), y quitar el aviso al pie de la sección.
2. Cambiar el `content` de las tres etiquetas `robots` a `index, follow`.
3. Reemplazar el `Disallow: /` de `robots.txt` por `Allow: /`.
4. Borrar la línea `X-Robots-Tag` del `.htaccess`.
5. Confirmar los derechos de uso de las tres fotos de la ciudad (Cristo Rey, Torre
   de Cali y los cholados).
