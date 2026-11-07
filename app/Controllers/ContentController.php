<?php
declare(strict_types=1);

final class ContentController
{
    public static function handle(string $type): never
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
            $isManageRequest = ($_GET['manage'] ?? '') === '1';

            if ($method === 'GET') {
                if ($isManageRequest) {
                    Auth::requireAdmin();
                }
            } elseif (in_array($method, ['POST', 'PUT', 'DELETE'], true)) {
                Auth::requireAdmin();
                Auth::verifyCsrf();
            } else {
                header('Allow: GET, POST, PUT, DELETE');
                Response::json(['error' => 'Método no permitido.'], 405);
            }

            $modelClass = match ($type) {
                'blog' => BlogPost::class,
                'biblioteca' => LibraryEntry::class,
                default => throw new InvalidArgumentException('Sección de contenido desconocida.'),
            };
            $model = new $modelClass(Database::connection());

            if ($method === 'GET') {
                if ($isManageRequest) {
                    Response::json(['items' => $model->all()]);
                }

                Response::json(['items' => $model->published()]);
            }

            if ($method === 'POST') {
                $data = self::validate($type, Request::json());
                $id = $model->create($data, (int) $_SESSION['admin_id']);
                Response::json(['item' => $model->find($id)], 201);
            }

            $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
            if (!$id || $id < 1) {
                Response::json(['error' => 'Se requiere un identificador válido.'], 400);
            }

            if ($method === 'PUT') {
                $data = self::validate($type, Request::json());
                if (!$model->update($id, $data)) {
                    Response::json(['error' => 'No se encontró el contenido solicitado.'], 404);
                }
                Response::json(['item' => $model->find($id)]);
            }

            if ($method === 'DELETE') {
                if (!$model->delete($id)) {
                    Response::json(['error' => 'No se encontró el contenido solicitado.'], 404);
                }
                Response::json(['message' => 'Contenido eliminado.']);
            }

            Response::json(['error' => 'Método no permitido.'], 405);
        } catch (InvalidArgumentException $exception) {
            Response::json(['error' => $exception->getMessage()], 422);
        } catch (PDOException $exception) {
            error_log($exception->getMessage());
            Response::json(['error' => 'No fue posible acceder a la base de datos. Verifica la configuración del servidor.'], 500);
        }
    }

    private static function validate(string $type, array $input): array
    {
        $fields = $type === 'blog'
            ? ['title', 'excerpt', 'content', 'category', 'image_url', 'published_at', 'is_published']
            : ['title', 'summary', 'content', 'category', 'image_url', 'source_url', 'published_at', 'is_published'];
        $unknown = array_diff(array_keys($input), $fields);
        if ($unknown !== []) {
            throw new InvalidArgumentException('La solicitud contiene campos no permitidos.');
        }

        $data = [];
        foreach (['title', 'content', 'category'] as $required) {
            $value = trim((string) ($input[$required] ?? ''));
            if ($value === '') {
                throw new InvalidArgumentException('Completa los campos título, categoría y contenido.');
            }
            $data[$required] = $value;
        }

        $lengthLimits = ['title' => 180, 'category' => 100, 'excerpt' => 300, 'summary' => 500];
        foreach (['excerpt', 'summary'] as $field) {
            if (in_array($field, $fields, true)) {
                $data[$field] = trim((string) ($input[$field] ?? ''));
            }
        }
        $data['content'] = trim((string) $input['content']);
        foreach (['title', 'category', 'excerpt', 'summary'] as $field) {
            if (isset($data[$field]) && mb_strlen($data[$field]) > $lengthLimits[$field]) {
                throw new InvalidArgumentException('Uno de los campos de texto supera la longitud permitida.');
            }
        }

        foreach (['image_url', 'source_url'] as $field) {
            if (in_array($field, $fields, true)) {
                $url = trim((string) ($input[$field] ?? ''));
                if ($url !== '' && !preg_match('~^(https?://|/|assets/)~i', $url)) {
                    throw new InvalidArgumentException('Las imágenes y fuentes deben usar una URL http(s) o una ruta local.');
                }
                $data[$field] = $url === '' ? null : $url;
            }
        }

        $date = trim((string) ($input['published_at'] ?? ''));
        if ($date === '') {
            $data['published_at'] = null;
        } else {
            $format = str_contains($date, 'T') ? '!Y-m-d\TH:i' : '!Y-m-d';
            $parsedDate = DateTimeImmutable::createFromFormat($format, $date);
            $dateErrors = DateTimeImmutable::getLastErrors();
            if (
                !$parsedDate
                || ($dateErrors !== false && ($dateErrors['warning_count'] > 0 || $dateErrors['error_count'] > 0))
                || $parsedDate->format(str_contains($date, 'T') ? 'Y-m-d\TH:i' : 'Y-m-d') !== $date
            ) {
                throw new InvalidArgumentException('La fecha debe tener un formato válido.');
            }
            $data['published_at'] = $parsedDate->format('Y-m-d H:i:s');
        }
        $data['is_published'] = !empty($input['is_published']) ? 1 : 0;

        return $data;
    }
}
