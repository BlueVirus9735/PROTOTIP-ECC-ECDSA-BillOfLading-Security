CREATE DATABASE IF NOT EXISTS pelindo_crypto;
USE pelindo_crypto;

DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('kph', 'phw', 'kadep') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed users with password 'password'
INSERT INTO users (username, password, role) VALUES 
('admin_kph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'kph'),
('admin_phw', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'phw'),
('admin_kadep', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'kadep');

CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    content_hash VARCHAR(255) NOT NULL,
    signature_path VARCHAR(255) DEFAULT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    status ENUM('Menunggu Review PHW', 'Menunggu Pengesahan Kadep', 'Disahkan') DEFAULT 'Menunggu Review PHW',
    uploaded_by INT,
    verified_by INT,
    signed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    FOREIGN KEY (verified_by) REFERENCES users(id),
    FOREIGN KEY (signed_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS keys_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_type VARCHAR(50) DEFAULT 'ECC-SECP256K1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
