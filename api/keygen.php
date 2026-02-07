<?php
// api/keygen.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include 'db.php';

$key_dir = realpath(__DIR__ . '/keys');
$python_script = realpath(__DIR__ . '/../crypto/keygen.py');

// Path to keys folder
$key_path = $key_dir;

// Execute python script
$command = "python $python_script \"$key_path\" 2>&1";
$output = shell_exec($command);

if (strpos($output, 'successfully') !== false) {
    // Insert record into keys_info table
    $stmt = $pdo->prepare("INSERT INTO keys_info (key_type) VALUES (?)");
    $stmt->execute(['ECC-SECP256K1']);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Keys generated successfully and recorded in database',
        'output' => $output
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to generate keys. Make sure Python and cryptography library are installed.',
        'output' => $output
    ]);
}
?>
