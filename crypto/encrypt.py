"""
ECIES Encryption (Elliptic Curve Integrated Encryption Scheme)
Mengenkripsi file menggunakan ECC (ECDH + AES-256-GCM)

Proses:
1. Generate ephemeral ECC key pair (SECP256K1)
2. ECDH key exchange: ephemeral private key + recipient public key → shared secret
3. Derive AES-256 key dari shared secret menggunakan HKDF-SHA256
4. Enkripsi data dengan AES-256-GCM
5. Output: [ephemeral_pubkey (65 bytes)] [nonce (12 bytes)] [ciphertext + tag]
"""

import sys
import os
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


def encrypt_file(public_key_path, input_path, output_path):
    # Load recipient's public key
    with open(public_key_path, "rb") as f:
        public_key = serialization.load_pem_public_key(f.read())

    # Read plaintext file
    with open(input_path, "rb") as f:
        plaintext = f.read()

    # Step 1: Generate ephemeral ECC key pair
    ephemeral_private_key = ec.generate_private_key(ec.SECP256K1())
    ephemeral_public_key = ephemeral_private_key.public_key()

    # Step 2: ECDH key exchange → shared secret
    shared_secret = ephemeral_private_key.exchange(ec.ECDH(), public_key)

    # Step 3: Derive AES-256 key using HKDF
    aes_key = HKDF(
        algorithm=hashes.SHA256(),
        length=32,  # 256-bit key for AES-256
        salt=None,
        info=b"ecies-enc",
    ).derive(shared_secret)

    # Step 4: Encrypt with AES-256-GCM
    nonce = os.urandom(12)  # 96-bit nonce for GCM
    aesgcm = AESGCM(aes_key)
    ciphertext = aesgcm.encrypt(nonce, plaintext, None)  # ciphertext includes 16-byte tag

    # Step 5: Serialize ephemeral public key (uncompressed, 65 bytes)
    ephemeral_pub_bytes = ephemeral_public_key.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint,
    )

    # Write output: [ephemeral_pubkey][nonce][ciphertext+tag]
    with open(output_path, "wb") as f:
        f.write(ephemeral_pub_bytes)  # 65 bytes
        f.write(nonce)                # 12 bytes
        f.write(ciphertext)           # len(plaintext) + 16 bytes (GCM tag)

    print(f"File encrypted successfully: {output_path}")


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python encrypt.py <public_key.pem> <input_file> <output_file.enc>")
        sys.exit(1)
    encrypt_file(sys.argv[1], sys.argv[2], sys.argv[3])
