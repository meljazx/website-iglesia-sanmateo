<?php
declare(strict_types=1);

final class Auth
{
    public static function startSession(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        session_set_cookie_params([
            'httponly' => true,
            'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
            'samesite' => 'Lax',
        ]);
        session_start();
    }

    public static function isAdmin(): bool
    {
        return isset($_SESSION['admin_id'], $_SESSION['admin_role'])
            && $_SESSION['admin_role'] === 'admin';
    }

    public static function requireAdmin(): void
    {
        if (!self::isAdmin()) {
            Response::json(['error' => 'Se requiere una sesión de administrador.'], 401);
        }
    }

    public static function csrfToken(): string
    {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }

        return $_SESSION['csrf_token'];
    }

    public static function verifyCsrf(): void
    {
        $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        $stored = $_SESSION['csrf_token'] ?? '';

        if (!is_string($provided) || !is_string($stored) || $stored === '' || !hash_equals($stored, $provided)) {
            Response::json(['error' => 'La sesión del formulario expiró. Recarga la página e inténtalo de nuevo.'], 419);
        }
    }
}
