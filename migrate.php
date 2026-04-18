<?php
include 'api/db.php';
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN session_token VARCHAR(255) DEFAULT NULL");
    echo "Migration success";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>
