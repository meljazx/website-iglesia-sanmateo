<?php
declare(strict_types=1);

final class Database
{
    private static ?PDO $connection = null;

    public static function connection(): PDO
    {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        $settings = [
            'host' => getenv('DB_HOST') ?: '127.0.0.1',
            'database' => getenv('DB_NAME') ?: 'iglesia_sanmateo',
            'username' => getenv('DB_USER') ?: 'root',
            'password' => getenv('DB_PASSWORD') ?: '',
        ];
        $localConfig = dirname(__DIR__, 2) . '/config/database.local.php';
        if (is_file($localConfig)) {
            $localSettings = require $localConfig;
            if (!is_array($localSettings)) {
                throw new RuntimeException('La configuración local de la base de datos debe retornar un arreglo.');
            }
            $settings = array_merge($settings, $localSettings);
        }

        $host = $settings['host'];
        $database = $settings['database'];
        $username = $settings['username'];
        $password = $settings['password'];
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $host, $database);

        self::$connection = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return self::$connection;
    }
}
