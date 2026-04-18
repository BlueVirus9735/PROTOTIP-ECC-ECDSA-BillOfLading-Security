"""
ECIES Decryption (Elliptic Curve Integrated Encryption Scheme)
Mendekripsi file yang dienkripsi menggunakan ECC (ECDH + AES-256-GCM)

Proses:
1. Parse ephemeral public key dari file terenkripsi (65 bytes pertama)
2. Parse nonce (12 bytes berikutnya)
3. ECDH key exchange: server private key + ephemeral public key → shared secret
4. Derive AES-256 key dari shared secret menggunakan HKDF-SHA256
5. Dekripsi ciphertext dengan AES-256-GCM
"""

import sys
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


# Constants matching encrypt.py
EPHEMERAL_PUBKEY_LEN = 65  # Uncompressed EC point for SECP256K1
NONCE_LEN = 12             # AES-GCM nonce


def decrypt_file(private_key_path, input_path, output_path):
    # Load server's private key
    with open(private_key_path, "rb") as f:
        private_key = serialization.load_pem_private_key(f.read(), password=None)

    # Read encrypted file
    with open(input_path, "rb") as f:
        data = f.read()

    # Step 1: Parse ephemeral public key
    ephemeral_pub_bytes = data[:EPHEMERAL_PUBKEY_LEN]
    ephemeral_public_key = ec.EllipticCurvePublicKey.from_encoded_point(
        ec.SECP256K1(), ephemeral_pub_bytes
    )

    # Step 2: Parse nonce
    nonce = data[EPHEMERAL_PUBKEY_LEN : EPHEMERAL_PUBKEY_LEN + NONCE_LEN]

    # Step 3: Ciphertext (includes GCM tag)
    ciphertext = data[EPHEMERAL_PUBKEY_LEN + NONCE_LEN :]

    # Step 4: ECDH key exchange → shared secret
    shared_secret = private_key.exchange(ec.ECDH(), ephemeral_public_key)

    # Step 5: Derive AES-256 key using HKDF (same params as encrypt)
    aes_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=None,
        info=b"ecies-enc",
    ).derive(shared_secret)

    # Step 6: Decrypt with AES-256-GCM
    aesgcm = AESGCM(aes_key)
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)

    # Write decrypted output
    with open(output_path, "wb") as f:
        f.write(plaintext)

    print(f"File decrypted successfully: {output_path}")


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python decrypt.py <private_key.pem> <input_file.enc> <output_file>")
        sys.exit(1)
    decrypt_file(sys.argv[1], sys.argv[2], sys.argv[3])
