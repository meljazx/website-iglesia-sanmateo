<?php
declare(strict_types=1);

abstract class ContentRepository
{
    public function __construct(protected PDO $db)
    {
    }

    abstract protected function table(): string;

    /** @return list<string> */
    abstract protected function editableFields(): array;

    /** @return list<string> */
    abstract protected function publicFields(): array;

    public function published(): array
    {
        $statement = $this->db->query(
            'SELECT ' . implode(', ', $this->publicFields())
            . ' FROM ' . $this->table()
            . ' WHERE is_published = 1 ORDER BY published_at DESC, id DESC'
        );

        return $statement->fetchAll();
    }

    public function all(): array
    {
        $statement = $this->db->query(
            'SELECT * FROM ' . $this->table() . ' ORDER BY published_at DESC, id DESC'
        );

        return $statement->fetchAll();
    }

    public function find(int $id): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM ' . $this->table() . ' WHERE id = :id');
        $statement->execute(['id' => $id]);
        $row = $statement->fetch();

        return $row === false ? null : $row;
    }

    public function create(array $data, int $adminId): int
    {
        $fields = $this->safeFields($data);
        $fields['created_by'] = $adminId;
        $columns = array_keys($fields);
        $parameters = array_map(static fn(string $column): string => ':' . $column, $columns);
        $sql = sprintf(
            'INSERT INTO %s (%s) VALUES (%s)',
            $this->table(),
            implode(', ', $columns),
            implode(', ', $parameters)
        );
        $statement = $this->db->prepare($sql);
        $statement->execute($fields);

        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = $this->safeFields($data);
        $assignments = array_map(static fn(string $column): string => $column . ' = :' . $column, array_keys($fields));
        $fields['id'] = $id;
        $statement = $this->db->prepare(
            'UPDATE ' . $this->table() . ' SET ' . implode(', ', $assignments) . ' WHERE id = :id'
        );
        $statement->execute($fields);

        return $statement->rowCount() > 0 || $this->find($id) !== null;
    }

    public function delete(int $id): bool
    {
        $statement = $this->db->prepare('DELETE FROM ' . $this->table() . ' WHERE id = :id');
        $statement->execute(['id' => $id]);

        return $statement->rowCount() > 0;
    }

    private function safeFields(array $data): array
    {
        $allowed = $this->editableFields();
        $unknown = array_diff(array_keys($data), $allowed);
        if ($unknown !== []) {
            throw new InvalidArgumentException('La solicitud contiene campos no permitidos.');
        }

        return $data;
    }
}
