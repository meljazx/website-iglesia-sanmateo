<?php
declare(strict_types=1);

$authenticated = Auth::isAdmin();
$csrfToken = Auth::csrfToken();
$adminEmail = htmlspecialchars((string) ($_SESSION['admin_email'] ?? ''), ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Administración | Iglesia San Mateo</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/admin.css">
  <script>
    window.ADMIN_STATE = <?= json_encode(
        ['authenticated' => $authenticated, 'csrfToken' => $csrfToken, 'email' => $adminEmail],
        JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
    ) ?>;
  </script>
  <script src="scripts.js/admin.js" defer></script>
</head>
<body class="admin-page">
  <main class="admin-shell">
    <a class="admin-back" href="index.html">← Volver al sitio</a>
    <section id="login-panel" class="admin-panel" <?= $authenticated ? 'hidden' : '' ?>>
      <h1>Administración</h1>
      <p>Ingresa con la cuenta de administrador de la parroquia.</p>
      <form id="login-form">
        <label for="login-email">Correo electrónico</label>
        <input id="login-email" name="email" type="email" autocomplete="username" required>
        <label for="login-password">Contraseña</label>
        <input id="login-password" name="password" type="password" autocomplete="current-password" required>
        <button class="admin-button" type="submit">Iniciar sesión</button>
      </form>
      <p id="login-message" class="admin-message" role="status"></p>
    </section>

    <section id="dashboard" class="admin-panel" <?= $authenticated ? '' : 'hidden' ?>>
      <div class="admin-heading">
        <div>
          <h1>Panel de contenido</h1>
          <p>Sesión: <span id="admin-email"><?= $adminEmail ?></span></p>
        </div>
        <button id="logout-button" class="admin-button admin-button--secondary" type="button">Cerrar sesión</button>
      </div>
      <div class="admin-workspace">
        <section>
          <label for="content-type">Sección</label>
          <select id="content-type">
            <option value="blog">Blog</option>
            <option value="biblioteca">Biblioteca</option>
          </select>
          <form id="content-form">
            <input id="content-id" type="hidden">
            <label for="content-title">Título</label>
            <input id="content-title" name="title" maxlength="180" required>
            <label for="content-category">Categoría</label>
            <input id="content-category" name="category" maxlength="100" required>
            <label for="content-summary" id="summary-label">Descripción breve</label>
            <textarea id="content-summary" name="summary" rows="3" maxlength="500"></textarea>
            <label for="content-body">Contenido</label>
            <textarea id="content-body" name="content" rows="8" required></textarea>
            <label for="content-image">Ruta o URL de imagen</label>
            <input id="content-image" name="image_url" maxlength="2048" placeholder="assets/images/blog/post-1.png">
            <label for="content-source" id="source-label" hidden>URL de fuente o documento</label>
            <input id="content-source" name="source_url" maxlength="2048" hidden>
            <label for="content-date">Fecha de publicación</label>
            <input id="content-date" name="published_at" type="datetime-local">
            <label class="admin-checkbox"><input id="content-published" type="checkbox"> Publicar en el sitio</label>
            <div class="admin-actions">
              <button class="admin-button" type="submit">Guardar</button>
              <button id="cancel-edit" class="admin-button admin-button--secondary" type="button" hidden>Cancelar edición</button>
            </div>
          </form>
          <p id="content-message" class="admin-message" role="status"></p>
        </section>
        <section>
          <h2>Entradas existentes</h2>
          <ul id="content-list" class="admin-list"></ul>
        </section>
      </div>
    </section>
  </main>
</body>
</html>
