<?php
declare(strict_types=1);

require_once __DIR__ . '/Core/Database.php';
require_once __DIR__ . '/Core/Response.php';
require_once __DIR__ . '/Core/Auth.php';
require_once __DIR__ . '/Core/Request.php';
require_once __DIR__ . '/Models/ContentRepository.php';
require_once __DIR__ . '/Models/BlogPost.php';
require_once __DIR__ . '/Models/LibraryEntry.php';
require_once __DIR__ . '/Controllers/ContentController.php';
require_once __DIR__ . '/Controllers/AuthController.php';

Auth::startSession();
