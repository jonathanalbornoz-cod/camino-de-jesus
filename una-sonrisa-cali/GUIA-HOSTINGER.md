# Guía: publicar la landing en Hostinger

Landing **LATAM Una Sola Sonrisa por Cali**. Es un sitio estático (HTML + CSS + imágenes):
no necesita WordPress, plugins, base de datos ni PHP. Se sube con el
**Administrador de archivos de Hostinger (hPanel)**, no con el plugin de WordPress
(ese plugin es el que estaba entregando los archivos corruptos).

No hay que descargar nada del sitio actual: solo se **sube** el ZIP de esta landing.

---

## Contenido del ZIP

```
una-sonrisa-cali/
├── index.html                  ← la página
├── estilos.css                 ← colores y diseño (paleta y letra del PDF)
├── GUIA-HOSTINGER.md           ← esta guía (no hace falta subirla)
└── img/
    ├── qr-pago.png             ← QR Bre-B recortado (se muestra en la página)
    ├── qr-pago-bancolombia.jpg ← QR completo (botón "Descargar QR")
    ├── hero-arte.jpg, flyer-1.jpg, flyer-2.jpg, favicon.svg
    └── 7 fotos de conferencistas (.jpg)
```

## Datos que ya trae la página

| Dato | Valor |
|---|---|
| WhatsApp (todos los botones + botón flotante) | +57 (312) 793-5907 |
| Banco / tipo | Bancolombia · Ahorros |
| Número de cuenta | 821-000117-55 (botón **Copiar**) |
| Llave Bre-B | @imagen3d (botón **Copiar**) |
| Titular (según el QR) | Imagen 3D Colombia S.A.S. |
| Valor | $240.000 COP |
| QR | Verificado: se lee correctamente y es el cobro Bre-B de la llave @imagen3d |

---

## Elija dónde publicarla

| Opción | Dirección final | Cuándo usarla |
|---|---|---|
| **A. Carpeta dentro de cursos** (más simple) | `https://cursos.gcgcolombia.com/una-sonrisa-cali/` | Recomendada: no crea nada nuevo y no toca WordPress |
| **B. Subdominio propio** | `https://sonrisa.gcgcolombia.com` (o el nombre que elija) | Si quiere una dirección corta para compartir en redes |

---

## Opción A: carpeta dentro de cursos.gcgcolombia.com

1. Entre a **hpanel.hostinger.com** → **Sitios web** → junto a `cursos.gcgcolombia.com`
   pulse **Administrar**.
2. Menú lateral → **Archivos** → **Administrador de archivos**.
3. Abra la carpeta **`public_html`**. Debe ver `wp-admin`, `wp-content`, `wp-config.php`:
   es la carpeta correcta.
4. Pulse el ícono **Subir** (flecha hacia arriba) → **Archivo** → elija `una-sonrisa-cali.zip`.
5. Clic derecho sobre el ZIP → **Extraer** → en el cuadro que aparece deje el destino
   tal cual (`public_html`) → **Extraer**.
6. Entre a la nueva carpeta `una-sonrisa-cali` y confirme que **adentro** están
   `index.html`, `estilos.css` y la carpeta `img`.
   - Si ve `una-sonrisa-cali/una-sonrisa-cali/…` (carpeta doble), entre a la de adentro,
     seleccione todo → **Mover** → un nivel arriba.
7. Borre el `.zip` de `public_html`.
8. Abra `https://cursos.gcgcolombia.com/una-sonrisa-cali/`.

> ⚠️ **No extraiga ni suba `index.html` suelto en `public_html`.** Reemplazaría la
> página de inicio de WordPress del sitio de cursos. Siempre dentro de su carpeta.

## Opción B: subdominio propio

1. hPanel → **Sitios web** → `cursos.gcgcolombia.com` (o el dominio principal
   `gcgcolombia.com` si está en Hostinger) → **Administrar** → **Dominios** → **Subdominios**.
2. Escriba el nombre (ej. `sonrisa`) → **Crear**. Hostinger crea una carpeta,
   normalmente `public_html/sonrisa`.
3. **Administrador de archivos** → entre a esa carpeta (`public_html/sonrisa`).
4. Suba el ZIP ahí y **Extraer**. Luego entre a `una-sonrisa-cali`, seleccione **todo su
   contenido** (index.html, estilos.css, img) → **Mover** → a `public_html/sonrisa`.
   Al final `public_html/sonrisa/index.html` debe existir directamente.
5. Borre el ZIP y la carpeta vacía `una-sonrisa-cali`.
6. hPanel → **Seguridad** → **SSL**: verifique que el subdominio tenga SSL activo
   (puede tardar unos minutos en emitirse) y active **Forzar HTTPS**.
7. Abra `https://sonrisa.gcgcolombia.com`.
   - Si el dominio `gcgcolombia.com` **no** tiene los DNS en Hostinger, cree en su
     proveedor de DNS un registro **A** `sonrisa` → la IP que muestra hPanel.
     Puede tardar hasta unas horas en propagarse.

---

## Pruebas finales (en computador y celular)

- [ ] Se ven el título, las fotos y los colores azules del PDF.
- [ ] Cada botón verde abre WhatsApp al **+57 312 793 5907** con el mensaje escrito.
- [ ] “Enviar comprobante por WhatsApp” abre el chat con el mensaje del comprobante.
- [ ] Los botones **Copiar** copian `82100011755` y `@imagen3d`.
- [ ] El **QR se escanea** desde otro celular y muestra *Imagen 3D Colombia S.A.S.*
- [ ] “Descargar QR” descarga la imagen completa de Bancolombia.
- [ ] “Cómo llegar” abre Google Maps.

Si ve una versión anterior: **Ctrl + F5**. Si usa LiteSpeed Cache / CDN de Hostinger:
hPanel → **Rendimiento** → **Caché** / **CDN** → **Purgar todo**.

## Errores comunes

| Síntoma | Causa | Solución |
|---|---|---|
| Error 404 | Carpeta en otro lugar o duplicada | Debe existir `…/una-sonrisa-cali/index.html` (A) o `public_html/sonrisa/index.html` (B) |
| Página sin colores (blanco y negro) | `estilos.css` no quedó junto a `index.html` | Muévalo a la misma carpeta |
| Imágenes rotas | Falta `img` o se cambiaron nombres | Respete nombres y minúsculas |
| La página de inicio de cursos cambió | Se extrajo `index.html` en `public_html` | Borre **solo** ese `index.html` suelto (y `estilos.css`, `img` sueltos) |
| “Sitio no seguro” en el subdominio | SSL aún no emitido | Espere o instálelo en hPanel → SSL |

## Cambios futuros (editar `index.html` con clic derecho → **Editar**)

- **Fecha y horario**: busque `Fecha y horario: pregúntanos por WhatsApp`
  (las piezas oficiales no traen fecha).
- **WhatsApp**: `var numero = '573127935907';` al final del archivo
  (código de país + número, sin `+` ni espacios) y el texto visible `+57 (312) 793-5907`.
- **Otro QR**: reemplace `img/qr-pago.png` y `img/qr-pago-bancolombia.jpg` con el mismo nombre.
- Cambie solo el texto entre etiquetas; no borre `<dd>`, `</dd>`, `<span …>`.
