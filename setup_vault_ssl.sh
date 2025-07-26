#!/bin/bash

set -e

# 1. Créer le dossier SSL
SSL_DIR="$HOME/ssl"
mkdir -p "$SSL_DIR"
echo "✅ Dossier créé : $SSL_DIR"

# 2. Générer une clé et un certificat auto-signé
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout "$SSL_DIR/key.pem" \
  -out "$SSL_DIR/cert.pem" \
  -subj "/CN=localhost"

echo "🔐 Certificat SSL généré dans $SSL_DIR"

# 3. Installer Vault si non présent
if ! command -v vault &> /dev/null; then
  echo "⬇️ Vault non trouvé, installation..."
  VAULT_VERSION="1.15.2"
  curl -Lo vault.zip https://releases.hashicorp.com/vault/${VAULT_VERSION}/vault_${VAULT_VERSION}_linux_amd64.zip
  unzip vault.zip
  sudo mv vault /usr/local/bin/
  rm vault.zip
  echo "✅ Vault installé"
else
  echo "✅ Vault est déjà installé"
fi

# 4. Lancer Vault en mode dev (en arrière-plan)
echo "🚀 Lancement de Vault en mode dev..."
vault server -dev > vault-dev.log 2>&1 &
VAULT_PID=$!

# 5. Attendre que Vault soit prêt
echo "⏳ Attente que Vault soit prêt..."
sleep 3  # option simple, sinon on pourrait faire un healthcheck

# 6. Exporter VAULT_ADDR
export VAULT_ADDR='http://127.0.0.1:8200'
echo "🔗 VAULT_ADDR défini à $VAULT_ADDR"

# 7. Exporter VAULT_TOKEN depuis le log
VAULT_TOKEN=$(grep 'Root Token:' vault-dev.log | awk '{ print $NF }')
export VAULT_TOKEN
echo "🔑 VAULT_TOKEN récupéré"

# 8. Envoyer les certs dans Vault
vault kv put secret/ssl/certs \
  cert=@"$SSL_DIR/cert.pem" \
  key=@"$SSL_DIR/key.pem"

echo "✅ Certificats SSL stockés dans Vault avec succès."

echo ""
echo "📦 Tu peux maintenant faire :"
echo "vault kv get secret/ssl/certs"
echo ""
echo "🔚 Pour arrêter Vault : kill $VAULT_PID"