<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $token = $data->token ?? '';
    $doc_id = $data->document_id ?? null;
    
    $stmt = $pdo->prepare("SELECT id FROM users WHERE session_token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    }

    if ($doc_id) {
        $stmt_upd = $pdo->prepare("UPDATE documents SET is_deleted = 1 WHERE id = ?");
        $stmt_upd->execute([$doc_id]);
        echo json_encode(['status' => 'success', 'message' => 'Dokumen berhasil dipindahkan ke tong sampah']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Missing document_id']);
    }
}
?>
