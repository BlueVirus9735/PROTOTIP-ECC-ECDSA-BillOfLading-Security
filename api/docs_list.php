<?php
// api/docs_list.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM documents ORDER BY created_at DESC");
    $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'data' => $documents
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch documents: ' . $e->getMessage()
    ]);
}
?>
