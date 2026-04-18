<?php
include 'db.php';
try {
    $pdo->exec("ALTER TABLE documents ADD COLUMN is_deleted TINYINT(1) DEFAULT 0");
    echo "Migration Success: Tambah kolom is_deleted\n";
} catch (Exception $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Migration Note: Kolom is_deleted sudah ada.\n";
    } else {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
?>
