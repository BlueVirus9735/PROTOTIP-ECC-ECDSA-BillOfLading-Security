<?php
header("Access-Control-Allow-Origin: *");
include "db.php";

$file = $_GET["file"] ?? "";
if (!$file || strpos($file, "..") !== false) {
    http_response_code(400);
    echo "File tidak valid";
    exit;
}

$path = __DIR__ . "/uploads/pdf/" . $file;
if (substr($file, -4) === '.sig') {
    $path = __DIR__ . "/uploads/signatures/" . $file;
}

if (!file_exists($path)) {
    http_response_code(404);
    echo "File tidak ditemukan " . $path;
    exit;
}

// Jika file terenkripsi (.enc), kita dekripsi dulu on-the-fly
if (substr($file, -4) === '.enc') {
    $private_key   = realpath(__DIR__ . '/keys/private_key.pem');
    $python_script = realpath(__DIR__ . '/../crypto/decrypt.py');
    $python_exe = 'C:\laragon\bin\python\python-3.10\python.exe';
    if (!file_exists($python_exe)) {
        $python_exe = __DIR__ . '/../crypto_venv/Scripts/python.exe';
    }

    $temp_decrypted = __DIR__ . "/uploads/temp/" . uniqid('dec_') . '.pdf';
    if (!is_dir(__DIR__ . "/uploads/temp/")) {
        mkdir(__DIR__ . "/uploads/temp/", 0777, true);
    }

    if (file_exists($python_exe) && file_exists($python_script) && file_exists($private_key)) {
        $command = "\"$python_exe\" \"$python_script\" \"$private_key\" \"$path\" \"$temp_decrypted\" 2>&1";
        shell_exec($command);

        if (file_exists($temp_decrypted)) {
            // Berhasil dekripsi, sajikan file PDF ini
            $download_name = substr($file, 0, -4); // hilangkan .enc
            header("Content-Type: application/pdf");
            header("Content-Disposition: attachment; filename=\"" . $download_name . "\"");
            header("Content-Length: " . filesize($temp_decrypted));
            readfile($temp_decrypted);
            
            // Hapus file temp setelah dihidangkan
            @unlink($temp_decrypted);
            exit;
        } else {
            http_response_code(500);
            echo "Gagal mendekripsi file dokumen.";
            exit;
        }
    } else {
         http_response_code(500);
         echo "Konfigurasi kriptografi server belum siap.";
         exit;
    }
} else {
    // Jika bukan file terenkripsi (fallback untuk dokumen lama yg sdh terlanjur diupload)
    header("Content-Type: application/pdf");
    header("Content-Disposition: attachment; filename=\"" . $file . "\"");
    header("Content-Length: " . filesize($path));
    readfile($path);
}
?>