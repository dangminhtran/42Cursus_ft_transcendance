#!/bin/sh
set -e

SSL_DIR="/ssl"

mkdir -p "$SSL_DIR"

openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout "$SSL_DIR/key.pem" \
  -out "$SSL_DIR/cert.pem" \
  -subj "/CN=localhost"

echo "🔐 Certificat généré dans $SSL_DIR"

vault kv put secret/ssl/certs \
  cert=@"$SSL_DIR/cert.pem" \
  key=@"$SSL_DIR/key.pem"

echo "✅ Certificat stocké dans Vault"
