<?php
// api/db.php
$host = 'localhost';
$db   = 'pelindo_crypto';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     // If database doesn't exist, we can handle it later or create it.
     // For now, we'll just throw a simple error message.
     die("Database connection failed. Please ensure 'pelindo_crypto' database exists.");
}
?>
