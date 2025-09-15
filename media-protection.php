<?php
require_once 'auth.php';
checkAuthentication();

// Get requested file
$file = isset($_GET['file']) ? $_GET['file'] : '';
if (empty($file)) {
    http_response_code(404);
    exit('File not found');
}

// Security: prevent directory traversal e supporto sottocartelle
$file = str_replace(['..', "\\", "\0"], '', $file);
$allowedDirs = ['media/', 'media/graduation/'];
$filePath = realpath(__DIR__ . '/media/' . ltrim($file, '/'));
if (!$filePath) {
    http_response_code(404);
    exit('File not found');
}
// Check if file is inside allowed directories
$isAllowed = false;
foreach ($allowedDirs as $dir) {
    $dirPath = realpath(__DIR__ . '/' . $dir);
    if ($dirPath && strpos($filePath, $dirPath) === 0) {
        $isAllowed = true;
        break;
    }
}
if (!$isAllowed || !file_exists($filePath)) {
    http_response_code(404);
    exit('File not found');
}

// Set content type
$extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
$contentTypes = [
    'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
    'gif' => 'image/gif', 'webp' => 'image/webp', 'heic' => 'image/heic',
    'mp4' => 'video/mp4', 'webm' => 'video/webm', 'ogg' => 'video/ogg',
    'mov' => 'video/quicktime', 'avi' => 'video/x-msvideo', 'json' => 'application/json'
];

// Funzione per gestire range requests (streaming video)
function handleRangeRequest($filePath, $fileSize) {
    $range = $_SERVER['HTTP_RANGE'];
    $ranges = explode('=', $range, 2);
    $offsets = explode('-', $ranges[1], 2);

    $offset = intval($offsets[0]);
    $length = (isset($offsets[1]) && is_numeric($offsets[1])) ? intval($offsets[1]) - $offset + 1 : $fileSize - $offset;

    header('HTTP/1.1 206 Partial Content');
    header('Accept-Ranges: bytes');
    header("Content-Range: bytes $offset-" . ($offset + $length - 1) . "/$fileSize");
    header("Content-Length: $length");
    header('Content-Type: video/mp4');

    $file = fopen($filePath, 'rb');
    fseek($file, $offset);
    echo fread($file, $length);
    fclose($file);
    exit();
}

// Funzione per ridimensionare immagini al volo
function resizeImage($imagePath, $width, $quality = 72) {
    $extension = strtolower(pathinfo($imagePath, PATHINFO_EXTENSION));
    $cacheDir = 'cache/';
    if (!is_dir($cacheDir)) {
        mkdir($cacheDir, 0755, true);
    }
    $cacheFile = $cacheDir . md5($imagePath . $width . $quality) . '.webp';
    if (file_exists($cacheFile) && filemtime($cacheFile) >= filemtime($imagePath)) {
        return $cacheFile;
    }
    if (extension_loaded('imagick')) {
        $imagick = new Imagick($imagePath);
        $imagick->resizeImage($width, 0, Imagick::FILTER_LANCZOS, 1);
        $imagick->setImageFormat('webp');
        $imagick->setImageCompressionQuality($quality);
        $imagick->setOption('webp:lossless', 'false');
        $imagick->writeImage($cacheFile);
        $imagick->clear();
        return $cacheFile;
    } elseif (extension_loaded('gd')) {
        $source = null;
        switch($extension) {
            case 'jpg':
            case 'jpeg':
                $source = imagecreatefromjpeg($imagePath);
                break;
            case 'png':
                $source = imagecreatefrompng($imagePath);
                break;
            case 'webp':
                $source = imagecreatefromwebp($imagePath);
                break;
        }
        if ($source) {
            $originalWidth = imagesx($source);
            $originalHeight = imagesy($source);
            $height = ($width / $originalWidth) * $originalHeight;
            $resized = imagecreatetruecolor($width, $height);
            imagecopyresampled($resized, $source, 0, 0, 0, 0, $width, $height, $originalWidth, $originalHeight);
            imagewebp($resized, $cacheFile, $quality);
            imagedestroy($source);
            imagedestroy($resized);
            return $cacheFile;
        }
    }
    return $imagePath;
}

// Gestione parametri resize
if (isset($_GET['w']) && is_numeric($_GET['w'])) {
    $width = min(1920, max(100, intval($_GET['w'])));
    $resizedPath = resizeImage($filePath, $width);
    if ($resizedPath !== $filePath) {
        $filePath = $resizedPath;
        header('Content-Type: image/webp');
        header('Cache-Control: public, max-age=31536000');
    }
}

// Serve file video con range
if ($extension === 'mp4') {
    header('Content-Type: video/mp4');
    header('Accept-Ranges: bytes');
    $fileSize = filesize($filePath);
    if (isset($_SERVER['HTTP_RANGE'])) {
        handleRangeRequest($filePath, $fileSize);
    } else {
        header('Content-Length: ' . $fileSize);
        readfile($filePath);
    }
    exit;
}

// Serve altri tipi di file
if (isset($contentTypes[$extension])) {
    header('Content-Type: ' . $contentTypes[$extension]);
}
header('Content-Length: ' . filesize($filePath));
readfile($filePath);
exit();
?>
        
        // Mantieni aspect ratio
        $imagick->resizeImage($width, 0, Imagick::FILTER_LANCZOS, 1);
        
        // Converti in WebP ottimizzato
        $imagick->setImageFormat('webp');
        $imagick->setImageCompressionQuality($quality);
        $imagick->setOption('webp:lossless', 'false');
        
        $imagick->writeImage($cacheFile);
        $imagick->clear();
        
        return $cacheFile;
        
    } elseif (extension_loaded('gd')) {
        // Fallback con GD
        $source = null;
        
        switch($extension) {
            case 'jpg':
            case 'jpeg':
                $source = imagecreatefromjpeg($imagePath);
                break;
            case 'png':
                $source = imagecreatefrompng($imagePath);
                break;
            case 'webp':
                $source = imagecreatefromwebp($imagePath);
                break;
        }
        
        if ($source) {
            $originalWidth = imagesx($source);
            $originalHeight = imagesy($source);
            $height = ($width / $originalWidth) * $originalHeight;
            
            $resized = imagecreatetruecolor($width, $height);
            imagecopyresampled($resized, $source, 0, 0, 0, 0, $width, $height, $originalWidth, $originalHeight);
            
            imagewebp($resized, $cacheFile, $quality);
            imagedestroy($source);
            imagedestroy($resized);
            
            return $cacheFile;
        }
    }
    
    return $imagePath; // Fallback all'originale
}

// Gestione parametri resize
if (isset($_GET['w']) && is_numeric($_GET['w'])) {
    $width = min(1920, max(100, intval($_GET['w']))); // Limita tra 100-1920px
    $resizedPath = resizeImage($filePath, $width);
    
    if ($resizedPath !== $filePath) {
        $filePath = $resizedPath;
        header('Content-Type: image/webp');
        header('Cache-Control: public, max-age=31536000'); // Cache 1 anno
    }
}
?>
<?php
require_once 'auth.php';
// ...existing code per servire immagini/video...
?>
