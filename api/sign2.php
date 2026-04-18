<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

include "db.php";

$data   = json_decode(file_get_contents("php://input"), true);
$token  = $data["token"] ?? "";
$doc_id = $data["doc_id"] ?? $data["document_id"] ?? 0;

if (!$token || !$doc_id) {
    echo json_encode(["status" => "error", "message" => "Parameter tidak lengkap"]);
    exit;
}

$stmt = $pdo->prepare("SELECT id, role FROM users WHERE session_token=?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Sesi tidak valid"]);
    exit;
}

if ($user["role"] !== "kadep") {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Hanya Kadep yang bisa mengesahkan"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM documents WHERE id=? AND is_deleted=0");
$stmt->execute([$doc_id]);
$doc = $stmt->fetch();

if (!$doc) {
    echo json_encode(["status" => "error", "message" => "Dokumen tidak ditemukan"]);
    exit;
}

$filename = $doc['filename'];
// Path file sumber (bisa .pdf atau .pdf.enc)
$source_path = __DIR__ . '/uploads/pdf/' . $filename;

if (!file_exists($source_path)) {
    echo json_encode(["status" => "error", "message" => "File fisik tidak ditemukan"]);
    exit;
}

$private_key   = realpath(__DIR__ . '/keys/private_key.pem');
$python_exe = 'C:\laragon\bin\python\python-3.10\python.exe';
if (!file_exists($python_exe)) {
    $python_exe = __DIR__ . '/../crypto_venv/Scripts/python.exe';
}

// 1. Jika terenkripsi, dekripsi sementara. Jika tidak, gunakan sumber langsung.
$temp_decrypted = null;
$doc_to_sign = $source_path;

if (substr($filename, -4) === '.enc') {
    $decrypt_script = realpath(__DIR__ . '/../crypto/decrypt.py');
    $temp_decrypted = __DIR__ . "/uploads/temp/" . uniqid('dec_') . '.pdf';
    
    if (!is_dir(__DIR__ . "/uploads/temp/")) {
        mkdir(__DIR__ . "/uploads/temp/", 0777, true);
    }
    
    $command = "\"$python_exe\" \"$decrypt_script\" \"$private_key\" \"$source_path\" \"$temp_decrypted\" 2>&1";
    shell_exec($command);
    
    if (file_exists($temp_decrypted)) {
        $doc_to_sign = $temp_decrypted;
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal mendekripsi dokumen untuk proses tanda tangan digital."]);
        exit;
    }
}

// 2. Buat signature (TTE ECDSA)
$sign_script = realpath(__DIR__ . '/../crypto/sign.py');
$sig_dir = __DIR__ . '/uploads/signatures/';
if (!is_dir($sig_dir)) {
    mkdir($sig_dir, 0777, true);
}

// nama signature misal: 1234_abc.pdf.enc.sig
$sig_filename = $filename . '.sig';
$sig_path = $sig_dir . $sig_filename;

$signed = false;
if (file_exists($python_exe) && file_exists($sign_script) && file_exists($private_key)) {
    $command = "\"$python_exe\" \"$sign_script\" \"$private_key\" \"$doc_to_sign\" \"$sig_path\" 2>&1";
    $output  = shell_exec($command);
    if (file_exists($sig_path)) {
        $signed = true;
    }
}

// 3. Hapus file temp
if ($temp_decrypted && file_exists($temp_decrypted)) {
    @unlink($temp_decrypted);
}

if (!$signed) {
    echo json_encode(["status" => "error", "message" => "Gagal menjalankan proses ECDSA Signing."]);
    exit;
}

// 4. Update database
$stmt = $pdo->prepare("UPDATE documents SET status=\"Disahkan\", signed_by=?, signature_path=? WHERE id=?");
$stmt->execute([$user["id"], $sig_filename, $doc_id]);

echo json_encode([
    "status" => "success", 
    "message" => "Dokumen berhasil disahkan dan file .sig telah terbentuk.",
    "signature_file" => $sig_filename
]);
?>