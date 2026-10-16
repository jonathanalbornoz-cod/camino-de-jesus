# Impordental

Tienda en línea de insumos y equipos odontológicos para **impordental.com**.
Reconstruida a partir del `deploy.zip` exportado del proyecto original
(Laravel 12 + panel administrativo Filament 3).

- `/` — portada con el catálogo (los 12 productos activos más recientes).
- `/admin` — portal administrativo: marcas, categorías y productos con imágenes.

## Qué se recuperó del ZIP y qué no

| Del ZIP | En este repositorio |
|---|---|
| `app/`, `config/`, `routes/`, `resources/`, `public/`, migraciones | Tal cual |
| `artisan`, `phpunit.xml`, `.gitignore` | Faltaban en el ZIP; son los de un Laravel 12 estándar |
| `.env` | **No se sube** (lleva la clave de la app y datos de conexión). Use `.env.example` |
| `impordental_database.sql` | **No se sube** (lleva el hash de la contraseña del admin y sesiones). Su catálogo está en `database/seeders/DatabaseSeeder.php` |
| Imágenes de `storage/app/public/products` | En `database/seeders/imagenes/`; el seeder las copia al disco público |
| `storage/logs/laravel.log`, `database.sqlite` | Descartados (log de errores y base vacía) |

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
4. **Enviar las visitas a `public/`**: cree `public_html/.htaccess` con:
   ```apache
   RewriteEngine On
   RewriteRule ^(.*)$ public/$1 [L]
   ```
   Así nadie puede abrir `.env`, `storage/` ni el código: todo pasa por `public/`.
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

Importe `impordental_database.sql` (el del ZIP, no está en el repositorio) desde
hPanel → **phpMyAdmin** → **Importar** en lugar de `migrate --seed`. Está en UTF-16;
si phpMyAdmin da error, conviértalo antes a UTF-8. Las imágenes de ese producto
habría que subirlas a `storage/app/public/products/`.

## Pendientes del sitio original

- Los enlaces del menú **Equipos** y **Educación** y el botón **Asesoría
  Especializada** apuntan a `#`: no llevan a ninguna parte todavía.
- No hay número de WhatsApp, correo ni dirección de contacto en la página.
