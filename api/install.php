<?php
// api/install.php
header('Content-Type: text/plain');
$host = 'localhost';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = file_get_contents(__DIR__ . '/init_db.sql');
    $pdo->exec($sql);
    
    echo "Success: Database 'pelindo_crypto' and tables have been initialized successfully!\n";
    echo "You can now use the application.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Make sure Laragon/MySQL is running and the 'root' user has no password (default).";
}
?>
