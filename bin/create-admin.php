<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/../app/Core/Database.php';

$email = trim((string) readline('Correo del administrador: '));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "Correo electrónico no válido.\n");
    exit(1);
}

$password = (string) readline('Contraseña (mínimo 12 caracteres): ');
if (strlen($password) < 12) {
    fwrite(STDERR, "La contraseña debe tener al menos 12 caracteres.\n");
    exit(1);
}

$statement = Database::connection()->prepare(
    'INSERT INTO admin_users (email, password_hash) VALUES (:email, :password_hash)'
);
$statement->execute([
    'email' => $email,
    'password_hash' => password_hash($password, PASSWORD_DEFAULT),
]);

fwrite(STDOUT, "Cuenta de administrador creada.\n");
