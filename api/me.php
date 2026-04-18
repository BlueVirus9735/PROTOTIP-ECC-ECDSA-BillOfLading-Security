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
$data = json_decode(file_get_contents("php://input"));
$token = $data->token ?? '';

if ($token) {
    $stmt = $pdo->prepare("SELECT id, username, role FROM users WHERE session_token = ?");
    $stmt->execute([$token]);
    if ($user = $stmt->fetch()) {
        echo json_encode(['status' => 'success', 'user' => $user]);
        exit;
    }
}
echo json_encode(['status' => 'error', 'message' => 'Invalid token']);
?>
