#!/bin/sh
set -e

# Variables Vault
export VAULT_ADDR='http://vault:8200'  # adapter si besoin (ex: 'http://127.0.0.1:8200')
VAULT_TOKEN_FILE=/vault/token.txt

if [ ! -f "$VAULT_TOKEN_FILE" ]; then
  echo "❌ Vault token file not found at $VAULT_TOKEN_FILE"
  exit 1
fi

export VAULT_TOKEN=$(cat "$VAULT_TOKEN_FILE")

echo "🔑 Vault token loaded"

echo "⏳ Attente que Vault soit prêt..."

# Attend que Vault réponde avec un statut 200 ou 429 (initialisation ou prêt)
until curl -s http://vault:8200/v1/sys/health | grep -q '"initialized":true'; do
  echo "⌛ Vault pas encore prêt..."
  sleep 5
done

echo "✅ Vault est prêt"

# Récupérer secrets
sleep 8
echo "⏳ Récupération des certificats depuis Vault..."
cert=$(vault kv get -field=cert secret/ssl/certs)
key=$(vault kv get -field=key secret/ssl/certs)

if [ -z "$cert" ] || [ -z "$key" ]; then
  echo "❌ Certificat ou clé vide, abort"
  exit 1
fi

echo "cert = $cert"
# Écrire cert & clé dans /etc/nginx/ssl/
echo "$cert" > /etc/nginx/ssl/cert.pem
echo "$key" > /etc/nginx/ssl/key.pem

echo "✅ Certificat et clé écrits dans /etc/nginx/ssl/"

# Lancer nginx
echo "🚀 Démarrage de nginx..."
# sleep infinity
exec /usr/local/nginx/nginx -g 'daemon off;'