<?php
// api/upload2.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Metode tidak diizinkan']);
    exit;
}

// Validasi token
$token = $_POST['token'] ?? '';
if (!$token) {
    echo json_encode(['status' => 'error', 'message' => 'Token tidak ditemukan']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, username, role FROM users WHERE session_token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Sesi tidak valid, silakan login ulang']);
    exit;
}

if ($user['role'] !== 'kph') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Akses ditolak: hanya role KPH yang bisa mengunggah']);
    exit;
}

// Validasi file
if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['status' => 'error', 'message' => 'File tidak ditemukan atau gagal diupload']);
    exit;
}

$file = $_FILES['document'];
$ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if ($ext !== 'pdf') {
    echo json_encode(['status' => 'error', 'message' => 'Hanya file PDF yang diizinkan']);
    exit;
}

// Simpan file
$upload_dir = __DIR__ . '/uploads/pdf/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$filename  = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($file['name']));
$dest_path = $upload_dir . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest_path)) {
    echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan file ke server']);
    exit;
}

// Hitung hash SHA-256
$hash = hash_file('sha256', $dest_path);

// Encrypt file menggunakan ECC via Python
$public_key   = realpath(__DIR__ . '/keys/public_key.pem');
$python_script = realpath(__DIR__ . '/../crypto/encrypt.py');
// Windows path
$python_exe = 'C:\laragon\bin\python\python-3.10\python.exe';
if (!file_exists($python_exe)) {
    $python_exe = __DIR__ . '/../crypto_venv/Scripts/python.exe';
}

$enc_path = $dest_path . '.enc';

$encrypted = false;
$output = "Python exec ($python_exe) atau script ($python_script) / key ($public_key) tidak ditemukan.";

if (file_exists($python_exe) && file_exists($python_script) && file_exists($public_key)) {
    $command = "\"$python_exe\" \"$python_script\" \"$public_key\" \"$dest_path\" \"$enc_path\" 2>&1";
    $output  = shell_exec($command);
    if (file_exists($enc_path)) {
        $encrypted = true;
        // Hapus file PDF mentah agar aman
        @unlink($dest_path);
        $filename = $filename . '.enc';
    } else {
        error_log("ECC encrypt gagal untuk $filename: $output");
    }
}

if (!$encrypted) {
    @unlink($dest_path);
    echo json_encode(['status' => 'error', 'message' => 'Enkripsi gagal: ' . $output]);
    exit;
}

$signature_path = null;

// Simpan ke database
try {
    $stmt = $pdo->prepare(
        "INSERT INTO documents (filename, original_name, content_hash, uploaded_by, signature_path, status)
         VALUES (?, ?, ?, ?, ?, 'Menunggu Review PHW')"
    );
    $stmt->execute([
        $filename,
        $file['name'],
        $hash,
        $user['id'],
        $signature_path,
    ]);

    echo json_encode([
        'status'   => 'success',
        'message'  => 'Dokumen berhasil diunggah dan diproses dengan keamanan ECC',
        'filename' => $filename,
        'hash'     => $hash,
        'signed'   => $signature_path !== null,
    ]);
} catch (\PDOException $e) {
    @unlink($dest_path);
    @unlink($enc_path);
    echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan ke database: ' . $e->getMessage()]);
}
?>
