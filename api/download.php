<?php
// api/download.php
header('Access-Control-Allow-Origin: *');

if (isset($_GET['file'])) {
    $file = $_GET['file'];
    $type = isset($_GET['type']) ? $_GET['type'] : 'doc';
    
    // Determine subdirectory based on file extension
    $sub_dir = (strpos($file, '.sig') !== false) ? 'signatures' : 'pdf';
    $base_dir = realpath(__DIR__ . '/uploads/' . $sub_dir);
    
    if (!$base_dir) {
        header("HTTP/1.0 404 Not Found");
        echo "Upload directory not found.";
        exit;
    }

    $requested_file = realpath($base_dir . '/' . basename($file));

    if ($requested_file && strpos($requested_file, $base_dir) === 0 && file_exists($requested_file)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($requested_file) . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($requested_file));
        readfile($requested_file);
        exit;
    } else {
        header("HTTP/1.0 404 Not Found");
        echo "File not found.";
    }
} else {
    echo "No file specified.";
}
?>
