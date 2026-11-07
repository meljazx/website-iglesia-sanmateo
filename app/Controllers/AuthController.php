<?php
declare(strict_types=1);

final class AuthController
{
    public static function handle(): never
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if ($method === 'GET') {
            Response::json([
                'authenticated' => Auth::isAdmin(),
                'csrf_token' => Auth::csrfToken(),
            ]);
        }

        if ($method !== 'POST') {
            header('Allow: GET, POST');
            Response::json(['error' => 'Método no permitido.'], 405);
        }

        Auth::verifyCsrf();
        try {
            $input = Request::json();
            $action = $input['action'] ?? '';

            if ($action === 'login') {
                $email = filter_var(trim((string) ($input['email'] ?? '')), FILTER_VALIDATE_EMAIL);
                $password = (string) ($input['password'] ?? '');
                if (!$email || $password === '') {
                    Response::json(['error' => 'Ingresa un correo y una contraseña válidos.'], 422);
                }

                $statement = Database::connection()->prepare(
                    "SELECT id, email, password_hash, role FROM admin_users WHERE email = :email AND role = 'admin' LIMIT 1"
                );
                $statement->execute(['email' => $email]);
                $admin = $statement->fetch();

                if ($admin === false || !password_verify($password, $admin['password_hash'])) {
                    Response::json(['error' => 'Correo o contraseña incorrectos.'], 401);
                }

                session_regenerate_id(true);
                $_SESSION['admin_id'] = (int) $admin['id'];
                $_SESSION['admin_role'] = $admin['role'];
                $_SESSION['admin_email'] = $admin['email'];
                $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
                Response::json([
                    'authenticated' => true,
                    'email' => $admin['email'],
                    'csrf_token' => $_SESSION['csrf_token'],
                ]);
            }

            if ($action === 'logout') {
                $_SESSION = [];
                session_regenerate_id(true);
                $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
                Response::json(['authenticated' => false, 'csrf_token' => $_SESSION['csrf_token']]);
            }

            Response::json(['error' => 'Acción desconocida.'], 400);
        } catch (InvalidArgumentException $exception) {
            Response::json(['error' => $exception->getMessage()], 422);
        } catch (PDOException $exception) {
            error_log($exception->getMessage());
            Response::json(['error' => 'No fue posible acceder a la base de datos. Verifica la configuración del servidor.'], 500);
        }
    }
}
