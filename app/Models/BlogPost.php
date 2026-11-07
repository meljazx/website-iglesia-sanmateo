<?php
declare(strict_types=1);

final class BlogPost extends ContentRepository
{
    protected function table(): string
    {
        return 'blog_posts';
    }

    protected function editableFields(): array
    {
        return ['title', 'excerpt', 'content', 'category', 'image_url', 'published_at', 'is_published'];
    }

    protected function publicFields(): array
    {
        return ['id', 'title', 'excerpt', 'content', 'category', 'image_url', 'published_at'];
    }
}
