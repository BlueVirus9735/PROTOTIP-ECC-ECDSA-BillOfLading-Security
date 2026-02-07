<?php
// api/verify.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['document']) && isset($_FILES['signature'])) {
        $doc_file = $_FILES['document'];
        $sig_file = $_FILES['signature'];
        
        $temp_dir = __DIR__ . '/uploads/temp/';
        if (!is_dir($temp_dir)) {
            mkdir($temp_dir, 0777, true);
        }
        
        $doc_path = $temp_dir . time() . '_verify_' . basename($doc_file['name']);
        $sig_path = $doc_path . '.sig';
        
        if (move_uploaded_file($doc_file['tmp_name'], $doc_path) && move_uploaded_file($sig_file['tmp_name'], $sig_path)) {
            $public_key = realpath(__DIR__ . '/keys/public_key.pem');
            $python_script = realpath(__DIR__ . '/../crypto/verify.py');
            
            $command = "python \"$python_script\" \"$public_key\" \"$doc_path\" \"$sig_path\" 2>&1";
            $output = shell_exec($command);
            
            $is_valid = (strpos($output, 'Signature is VALID') !== false);
            
            echo json_encode([
                'status' => 'success',
                'is_valid' => $is_valid,
                'message' => $is_valid ? 'Signature is VALID' : 'Signature is INVALID or modified',
                'output' => trim($output)
            ]);
            
            // Cleanup temp files
            unlink($doc_path);
            unlink($sig_path);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to process files for verification']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Both document and signature files are required']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
