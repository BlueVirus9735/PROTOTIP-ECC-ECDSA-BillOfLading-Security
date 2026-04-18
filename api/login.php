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
    $username = $data->username ?? '';
    // $password = $data->password ?? ''; // skipping password check for simplified mockup or checking if provided
    $password_input = $data->password ?? '';

    if (!$username || !$password_input) {
        echo json_encode(['status' => 'error', 'message' => 'Username dan password diperlukan']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password_input, $user['password'])) {
        $token = bin2hex(random_bytes(32));
        $pdo->prepare("UPDATE users SET session_token = ? WHERE id = ?")->execute([$token, $user['id']]);

        echo json_encode([
            'status' => 'success',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role']
            ]
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Username atau password salah']);
    }
}
?>
