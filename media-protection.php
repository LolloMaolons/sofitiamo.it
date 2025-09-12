<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(403);
    exit('Access denied');
}

// Get requested file
$file = isset($_GET['file']) ? $_GET['file'] : '';
if (empty($file)) {
    http_response_code(404);
    exit('File not found');
}

// Security: prevent directory traversal
$file = basename($file);
$filePath = __DIR__ . '/media/' . $file;

// Check if file exists
if (!file_exists($filePath)) {
    http_response_code(404);
    exit('File not found');
}

// Set content type
$extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
$contentTypes = [
    'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
    'gif' => 'image/gif', 'webp' => 'image/webp', 'heic' => 'image/heic',
    'mp4' => 'video/mp4', 'webm' => 'video/webm', 'ogg' => 'video/ogg',
    'mov' => 'video/quicktime', 'avi' => 'video/x-msvideo', 'json' => 'application/json'
];

if (isset($contentTypes[$extension])) {
    header('Content-Type: ' . $contentTypes[$extension]);
}

header('Content-Length: ' . filesize($filePath));
readfile($filePath);
exit();
?>
    'mp4' => 'video/mp4',
    'webm' => 'video/webm',
    'ogg' => 'video/ogg',
    'mov' => 'video/quicktime',
    'avi' => 'video/x-msvideo',
    'json' => 'application/json'
];

if (isset($contentTypes[$extension])) {
    header('Content-Type: ' . $contentTypes[$extension]);
}

header('Content-Length: ' . filesize($filePath));

error_log("Serving file: " . $filePath);
readfile($filePath);
exit();
?>
