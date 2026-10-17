# Impordental

Tienda en línea de insumos y equipos odontológicos para **impordental.com**.
Recuperada del repositorio original `jonas0214/Impordental` (rama `main`, commit
`27507e1` «corporate standard v20.1»), Laravel 12 + panel administrativo Filament 3.

- `/` — portada con el catálogo (los 12 productos activos más recientes).
- `/admin` — portal administrativo: marcas, categorías y productos con imágenes.

## De dónde sale

Los ZIP de iLoveZIP traían todos los archivos sueltos, sin carpetas, pero entre
ellos venía la carpeta `.git` del proyecto. Con sus objetos se reconstruyó el
árbol exacto de `main` y se copió aquí.

| Del proyecto original | En este repositorio |
|---|---|
| Código, vistas, estilos, `public/build` (Vite ya compilado), `public/images`, `.htaccess`, `deploy.sh` | Tal cual |
| `.env` | **No se sube** (lleva la clave de la app). Use `.env.example` |
| `impordental_database.sql` | **No se sube** (lleva el hash de la contraseña del admin). Su catálogo está en `database/seeders/DatabaseSeeder.php` |
| `composer.phar`, `deploy.zip` | Descartados: Composer se instala aparte y el ZIP se genera con `deploy.sh` |

Cambio propio sobre el original: reglas para tabletas y celulares al final de
`resources/css/app.css` (antes el menú se salía de la pantalla y la tarjeta de
producto quedaba aplastada). Tras editar ese archivo hay que correr `npm run build`.

## Probarlo en el computador

Requiere PHP 8.2+ y Composer.

```bash
cd impordental
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
php artisan make:filament-user   # crea el administrador (nombre, correo, contraseña)
php artisan serve
```

Abra http://localhost:8000 y http://localhost:8000/admin.

El portal solo deja entrar a usuarios con `is_admin = 1`. Después de
`make:filament-user`, márquelo así:

```bash
php artisan tinker --execute="App\Models\User::where('email','SU_CORREO')->update(['is_admin'=>true]);"
```

## Publicar en Hostinger (impordental.com)

Hostinger compartido corre PHP y MySQL, así que la app funciona tal cual.

1. **Base de datos**: hPanel → **Bases de datos** → **MySQL** → cree base, usuario y
   contraseña. Anote los tres datos y el host (normalmente `localhost`).
2. **Preparar el paquete** en su computador:
   ```bash
   cd impordental
   composer install --no-dev --optimize-autoloader
   ```
   Comprima la carpeta `impordental` completa (incluida `vendor/`) en `impordental.zip`.
3. **Subir**: hPanel → **Administrador de archivos** → abra `public_html` del
   dominio, vacíela (o guarde una copia de lo que haya) y suba ahí el ZIP.
   Extráigalo y mueva el **contenido** de la carpeta `impordental` a `public_html`:
   debe quedar `public_html/artisan`, `public_html/public/index.php`, etc.
4. **Enviar las visitas a `public/`**: el proyecto ya trae `.htaccess` en la raíz,
   que manda todo a `public/`. Así nadie puede abrir `.env`, `storage/` ni el código.
   Compruebe que quedó en `public_html/.htaccess` (el Administrador de archivos oculta
   los archivos que empiezan por punto: actívelos en su configuración).
5. **Configurar `.env`**: copie `.env.example` a `.env` y cambie:
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://impordental.com
   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=(la base creada)
   DB_USERNAME=(el usuario creado)
   DB_PASSWORD=(la contraseña)
   ```
6. **Terminal SSH** (hPanel → **Avanzado** → **Acceso SSH**):
   ```bash
   cd domains/impordental.com/public_html
   php artisan key:generate --force
   php artisan migrate --seed --force
   php artisan storage:link
   php artisan make:filament-user
   php artisan config:cache && php artisan route:cache && php artisan view:cache
   ```
   y marque al usuario como administrador con el comando `tinker` de arriba.
7. **SSL**: hPanel → **Seguridad** → **SSL** → active y fuerce HTTPS.

### Si prefiere recuperar la base de datos original

Importe `impordental_database.sql` (está en los ZIP, no en el repositorio) desde
hPanel → **phpMyAdmin** → **Importar** en lugar de `migrate --seed`. Trae el mismo
producto de ejemplo y el usuario admin original.

## Pendientes del sitio original

- **Datos de contacto de ejemplo** en el pie de página: «Calle Comercial #45-67,
  Bogotá» y «+57 (601) 123 4567». Hay que cambiarlos por los reales.
- **Enlaces vacíos**: Equipos, Ortodoncia, Estética, Ofertas, «Ver detalles» y los
  enlaces del pie apuntan a `#`; no llevan a ninguna parte todavía.
- El catálogo solo tiene el producto de prueba «Crema dental». En los ZIP venían
  fotos de otros dos productos (Colgate Total 12 Econo Pack y una unidad
  odontológica) que no están en la base de datos: se cargan desde `/admin`.
