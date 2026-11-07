# Iglesia San Mateo

Sitio parroquial con páginas públicas de inicio, blog y biblioteca, más un panel privado para administrar publicaciones y documentos. El backend usa PHP 8.1+ y MySQL/MariaDB; ejecútalo desde Apache (por ejemplo, XAMPP o Laragon), no abriendo los HTML con `file://`.

## Arquitectura MVC

- **Modelos:** `app/Models/` contiene los repositorios para las entradas del blog y la biblioteca.
- **Vistas:** las páginas públicas HTML y `views/admin.php` presentan el contenido; los scripts de `scripts.js/` consumen la API y actualizan las vistas.
- **Controladores:** `app/Controllers/` valida solicitudes y coordina modelos y respuestas.
- **API:** `api/content.php` ofrece lectura pública y operaciones administrativas; `api/auth.php` inicia y cierra sesiones de administrador.
- **Persistencia:** `database/schema.sql` crea `admin_users`, `blog_posts` y `library_entries` dentro de `iglesia_sanmateo`.

Las visitas públicas solo reciben entradas publicadas. Crear, editar, publicar y eliminar requiere autenticación con rol `admin`, sesión protegida y token CSRF. Las contraseñas se guardan mediante `password_hash`; no existe registro público de usuarios.

## Instalación local en Laragon

1. Inicia Apache y MySQL/MariaDB desde Laragon y habilita la extensión PHP `pdo_mysql`.
2. Importa `database/schema.sql` con HeidiSQL o phpMyAdmin. El script crea la base de datos y las tres tablas.
3. Copia `config/database.example.php` como `config/database.local.php` y ajusta host, base, usuario y contraseña. Ese archivo local está excluido de Git. Si no existe, la configuración usa los valores predeterminados habituales de Laragon (`127.0.0.1`, base `iglesia_sanmateo`, usuario `root` sin contraseña).
4. Desde la raíz del proyecto, crea la primera cuenta administrativa:

   ```powershell
   php bin\create-admin.php
   ```

   El comando solicita correo y contraseña (mínimo 12 caracteres) y persiste únicamente el hash.
5. Abre `http://website-iglesia-sanmateo.test/admin.php` (o la URL local configurada en Laragon). Blog y biblioteca se muestran en sus páginas habituales y solo listan contenido publicado.

El panel permite crear, editar, publicar/despublicar y eliminar contenido. Para las imágenes se admite una URL `http(s)` o una ruta local, como `assets/images/blog/post-1.png`; no se implementa carga de archivos.

## Instalación local en XAMPP

1. Instala XAMPP con PHP 8.1 o superior y MySQL/MariaDB. Abre el **XAMPP Control Panel** e inicia **Apache** y **MySQL**.
2. Copia la carpeta del proyecto dentro de `C:\xampp\htdocs\` (por ejemplo, `C:\xampp\htdocs\website-iglesia-sanmateo`). Usa esa carpeta como raíz del proyecto.
3. En el Control Panel de XAMPP, junto a Apache, selecciona **Config → PHP (php.ini)**. Verifica que `extension=pdo_mysql` esté habilitada (sin `;` al inicio); guarda los cambios y reinicia Apache si modificaste el archivo.
4. Abre `http://localhost/phpmyadmin`, selecciona **Importar**, elige `database/schema.sql` dentro de la carpeta del proyecto y pulsa **Importar**. El script crea la base `iglesia_sanmateo` y sus tablas.
5. Si tu instalación tiene credenciales MySQL distintas a las habituales, copia `config/database.example.php` como `config/database.local.php` y actualiza host, base, usuario y contraseña. La configuración predeterminada usa `127.0.0.1`, base `iglesia_sanmateo`, usuario `root` y contraseña vacía; es adecuada solo para una instalación local sin contraseña de root.
6. Abre **Shell** desde el Control Panel de XAMPP y ejecuta:

   ```bat
   cd \xampp\htdocs\website-iglesia-sanmateo
   php bin\create-admin.php
   ```

   Si el comando `php` no está disponible en la Shell, usa la ruta completa:

   ```bat
   C:\xampp\php\php.exe bin\create-admin.php
   ```

   Ingresa el correo del administrador y una contraseña de al menos 12 caracteres.
7. Visita `http://localhost/website-iglesia-sanmateo/admin.php` para iniciar sesión. El blog y la biblioteca quedan disponibles en `/blog.html` y `/biblioteca.html`.

No uses las credenciales locales predeterminadas en un servidor público. En XAMPP, verifica además que Apache permita `.htaccess` (`AllowOverride All`) para aplicar las restricciones de acceso a carpetas internas.

## API

- `GET api/content.php?type=blog`
- `GET api/content.php?type=biblioteca`
- `GET api/content.php?type=blog&manage=1` — sesión de administrador obligatoria.
- `POST api/content.php?type=blog` — crear; `PUT api/content.php?type=blog&id=ID` — actualizar; `DELETE api/content.php?type=blog&id=ID` — eliminar.
- Reemplaza `blog` por `biblioteca` para operar sobre la biblioteca. Las operaciones de escritura requieren el encabezado `X-CSRF-Token`.

La API devuelve JSON. Los formularios del panel ya gestionan las solicitudes, los mensajes de error y los filtros de contenido publicados.

## Producción

Configura `DB_HOST`, `DB_NAME`, `DB_USER` y `DB_PASSWORD` en el entorno de PHP, usa una cuenta MySQL dedicada con permisos mínimos y habilita HTTPS. No uses las credenciales locales predeterminadas en un servidor público.
