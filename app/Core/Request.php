<?php
declare(strict_types=1);

final class Request
{
    public static function json(): array
    {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw === false ? '' : $raw, true);

        if (!is_array($data)) {
            throw new InvalidArgumentException('El cuerpo de la solicitud debe ser un objeto JSON válido.');
        }

        return $data;
    }
}
