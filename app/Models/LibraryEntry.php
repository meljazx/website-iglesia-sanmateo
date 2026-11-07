<?php
declare(strict_types=1);

final class LibraryEntry extends ContentRepository
{
    protected function table(): string
    {
        return 'library_entries';
    }

    protected function editableFields(): array
    {
        return ['title', 'summary', 'content', 'category', 'image_url', 'source_url', 'published_at', 'is_published'];
    }

    protected function publicFields(): array
    {
        return ['id', 'title', 'summary', 'content', 'category', 'image_url', 'source_url', 'published_at'];
    }
}
