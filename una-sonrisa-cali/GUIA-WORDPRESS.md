# Guía: publicar la landing en cursos.gcgcolombia.com

Landing **LATAM Una Sola Sonrisa por Cali**: sitio estático (HTML + CSS), sin plugins
ni base de datos. Se sube como una carpeta al lado de WordPress y queda en:

**https://cursos.gcgcolombia.com/una-sonrisa-cali/**

WordPress no se toca: su `.htaccess` deja pasar cualquier carpeta que exista de verdad,
así que la landing y el sitio de cursos conviven sin interferir.

> ¿Por qué no pegarla dentro de una página de WordPress? El tema y los constructores
> (Elementor, etc.) aplican sus propios estilos y rompen colores, letras y espaciado.
> Como carpeta independiente se ve exactamente igual que en el diseño.

---

## Estructura de la carpeta

```
una-sonrisa-cali/
├── index.html          ← la página (aquí se editan los datos bancarios)
├── estilos.css         ← colores y diseño (no hace falta tocarlo)
├── GUIA-WORDPRESS.md   ← esta guía (opcional subirla)
└── img/
    ├── qr-pago.png     ← MARCADOR DEL QR: se reemplaza por el QR real
    ├── hero-arte.jpg, flyer-1.jpg, flyer-2.jpg
    ├── favicon.svg
    └── (7 fotos de conferencistas).jpg
```

## Secciones de la landing (en orden)

1. **Barra superior**: marca + menú + botón de WhatsApp.
2. **Portada**: título LATAM / Una sola Sonrisa / Por Cali, descripción y botón “Inscribirme por WhatsApp”.
3. **Datos clave**: “Tu inscripción también suma”, bono $240.000, lugar.
4. **La causa**: odontología digital, referentes LATAM, solidaridad.
5. **Conferencistas invitados**: los 7 ponentes con país y tema.
6. **Inscripción**: “Aprendemos juntos. Ayudamos juntos.” + 3 pasos.
7. **Datos para tu pago**: banco, tipo y número de cuenta (con botón Copiar), titular, NIT/C.C., valor, **QR** y botón “Enviar comprobante por WhatsApp”.
8. **Lugar**: dirección, “Cómo llegar” (Google Maps) y descarga de las piezas oficiales.
9. **Pie** + **botón flotante de WhatsApp** (siempre visible).

Todos los botones de WhatsApp abren el **+57 (312) 793-5907** con un mensaje ya escrito.

---

## Paso a paso

### Paso 0: copia de seguridad
Ya tiene una copia del gestor de archivos. Confirme que es reciente. En este proceso
**no se modifica ningún archivo de WordPress**, solo se agrega una carpeta nueva.

### Paso 1: preparar el ZIP en su computador
1. Descargue la carpeta `una-sonrisa-cali` completa.
2. Clic derecho sobre la carpeta → **Comprimir / Enviar a → Carpeta comprimida (zip)**.
3. Debe quedar `una-sonrisa-cali.zip` y, **al abrirlo, debe verse la carpeta `una-sonrisa-cali`**
   (no los archivos sueltos).

### Paso 2: abrir el gestor de archivos
1. Entre a `https://cursos.gcgcolombia.com/wp-admin`.
2. Menú lateral → **File Manager Advanced**.
3. Quédese en la **carpeta raíz** (la que se abre por defecto). Debe ver `wp-admin`,
   `wp-content`, `wp-includes`, `wp-config.php` y `.htaccess`. **Ese es el lugar correcto.**

### Paso 3: subir y descomprimir
1. Botón **Upload files** (ícono de nube/flecha) → elija `una-sonrisa-cali.zip`.
2. Clic derecho sobre el zip → **Extract files** (Extraer aquí).
3. Entre a la nueva carpeta `una-sonrisa-cali` y verifique que **adentro** están
   `index.html`, `estilos.css` y la carpeta `img`.
   - Si ve `una-sonrisa-cali/una-sonrisa-cali/…` (carpeta doble), mueva el contenido
     un nivel arriba o repita el zip del paso 1.
4. Borre el `.zip` de la raíz (ya no se necesita).

> ⚠️ **No suba `index.html` suelto a la raíz.** En muchos hostings `index.html` tiene
> prioridad sobre el `index.php` de WordPress y **reemplazaría la página de inicio del
> sitio de cursos**. Siempre dentro de la carpeta `una-sonrisa-cali`.

### Paso 4: poner los datos bancarios
1. Dentro de `una-sonrisa-cali`, clic derecho en `index.html` → **Code Editor** (o *Edit*).
2. Busque (Ctrl + F) la sección `DATOS BANCARIOS` y cambie **solo el texto entre corchetes**:

   | Busque                  | Reemplace por (ejemplo)          |
   |-------------------------|----------------------------------|
   | `[NOMBRE DEL BANCO]`    | `Bancolombia`                    |
   | `[AHORROS / CORRIENTE]` | `Ahorros`                        |
   | `[000-000000-00]`       | `123-456789-01`                  |
   | `[NOMBRE DEL TITULAR]`  | `Fundación / nombre completo`    |
   | `[000.000.000-0]`       | `NIT 900.123.456-7`              |

   - Borre también los corchetes `[ ]`.
   - **No borre** las etiquetas como `<dd>`, `</dd>` ni `<span id="numero-cuenta">`.
     Ejemplo correcto:
     `<dd>[NOMBRE DEL BANCO]</dd>` → `<dd>Bancolombia</dd>`
3. **Save** / Guardar.

### Paso 5: poner el código QR
1. Pida el QR de cobro en la app del banco (Bre-B / QR de cobro) y guárdelo como imagen.
2. Renómbrelo **exactamente** `qr-pago.png` (todo en minúsculas).
   - Si su archivo es `.jpg`, conviértalo a PNG (por ejemplo, ábralo en Paint →
     *Guardar como* → PNG).
3. En el gestor: entre a `una-sonrisa-cali/img/` → **Upload files** → suba `qr-pago.png`
   → cuando pregunte, elija **Reemplazar / Overwrite**.

### Paso 6: probar
1. Abra `https://cursos.gcgcolombia.com/una-sonrisa-cali/` en el computador **y** en el celular.
2. Revise:
   - [ ] Se ven el título, las fotos y los colores azules.
   - [ ] Los datos bancarios son correctos y el botón **Copiar** copia el número.
   - [ ] El QR se ve y **se puede escanear** desde otro celular.
   - [ ] Cada botón verde abre WhatsApp con el +57 312 793 5907.
   - [ ] “Cómo llegar” abre Google Maps.
3. Si ve la versión vieja (QR de ejemplo, corchetes): recargue con **Ctrl + F5**. Si usa
   un plugin de caché (LiteSpeed Cache, WP Rocket, W3 Total Cache) o Cloudflare,
   **purgue la caché**.

### Paso 7 (opcional): enlazarla desde WordPress
**Apariencia → Menús → Enlaces personalizados**:
URL `https://cursos.gcgcolombia.com/una-sonrisa-cali/`, texto “Una sonrisa por Cali” →
*Añadir al menú* → *Guardar menú*.

---

## Errores comunes

| Síntoma | Causa | Solución |
|---|---|---|
| Error 404 | La carpeta quedó en otro lugar o duplicada | Debe existir `raíz/una-sonrisa-cali/index.html` |
| Página sin estilos (todo en blanco y negro) | `estilos.css` no quedó junto a `index.html` | Muévalo a la misma carpeta |
| Imágenes rotas | Falta la carpeta `img` o cambió nombres | Respete nombres y minúsculas |
| El QR sigue siendo el de ejemplo | Caché o nombre distinto | Nombre exacto `qr-pago.png` + Ctrl + F5 |
| La página de inicio de cursos cambió | Se subió `index.html` a la raíz | Bórrelo de la raíz (solo ese archivo) |
| La página se ve desordenada tras editar | Se borró una etiqueta `<…>` | Restaure `index.html` desde el ZIP y edite de nuevo |

## Otros cambios rápidos (todos en `index.html`)
- **Número de WhatsApp**: busque `var numero = '573127935907';` (código de país + número,
  sin `+` ni espacios). Actualice también el texto visible `+57 (312) 793-5907`.
- **Mensaje automático de WhatsApp**: las líneas `wa('Hola, …')` al final del archivo.
- **Fecha y horario**: busque `Fecha y horario: pregúntanos por WhatsApp` y cámbielo
  cuando esté confirmado (las piezas oficiales no traen fecha).
