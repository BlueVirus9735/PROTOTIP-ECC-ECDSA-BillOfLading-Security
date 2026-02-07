<?php
// api/sign.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['document'])) {
        $file = $_FILES['document'];
        $pdf_dir = __DIR__ . '/uploads/pdf/';
        $sig_dir = __DIR__ . '/uploads/signatures/';
        $filename = time() . '_' . basename($file['name']);
        $target_pdf = $pdf_dir . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $target_pdf)) {
            // Check for duplicate content using hash
            $content_hash = hash_file('sha256', $target_pdf);
            $check_stmt = $pdo->prepare("SELECT id FROM documents WHERE content_hash = ?");
            $check_stmt->execute([$content_hash]);
            
            if ($check_stmt->fetch()) {
                unlink($target_pdf); // Delete the uploaded file as it's a duplicate
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Dokumen ini sudah pernah ditandatangani sebelumnya. Silakan cek menu Riwayat.'
                ]);
                exit;
            }

            $private_key = realpath(__DIR__ . '/keys/private_key.pem');
            $python_script = realpath(__DIR__ . '/../crypto/sign.py');
            $signature_file = $sig_dir . $filename . '.sig';
            
            $command = "python \"$python_script\" \"$private_key\" \"$target_pdf\" \"$signature_file\" 2>&1";
            $output = shell_exec($command);
            
            if (strpos($output, 'successfully') !== false) {
                // Save to database (store relative paths/filenames and the hash)
                $stmt = $pdo->prepare("INSERT INTO documents (filename, original_name, content_hash, signature_path) VALUES (?, ?, ?, ?)");
                $stmt->execute([$filename, $file['name'], $content_hash, $filename . '.sig']);
                $doc_id = $pdo->lastInsertId();
                
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Document signed successfully',
                    'document_id' => $doc_id,
                    'filename' => $filename,
                    'signature_file' => $filename . '.sig'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Signing failed',
                    'output' => $output
                ]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to upload file']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No document provided']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
