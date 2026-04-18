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
    $username = $data->username ?? '';
    $password = $data->password ?? '';
    
    $stmt = $pdo->prepare("SELECT id FROM users WHERE session_token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    }

    if ($username || $password) {
        $updates = [];
        $params = [];
        
        if ($username) {
            $updates[] = "username = ?";
            $params[] = $username;
        }
        
        if ($password) {
            $updates[] = "password = ?";
            $params[] = password_hash($password, PASSWORD_DEFAULT);
        }
        
        $params[] = $user['id'];
        
        $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
        $stmt_upd = $pdo->prepare($sql);
        try {
            $stmt_upd->execute($params);
            echo json_encode(['status' => 'success', 'message' => 'Profil berhasil diperbarui']);
        } catch(PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Username mungkin sudah dipakai yang lain.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Nothing to update']);
    }
}
?>
