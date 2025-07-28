#!/bin/bash
set -e

# Démarrer Vault en arrière-plan
vault server -dev > vault.log 2>&1 &
VAULT_PID=$!

# Attendre que Vault soit prêt
echo "⏳ Démarrage de Vault..."
sleep 3

# Récupérer le token root
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN=$(grep 'Root Token:' vault.log | awk '{ print $NF }')

# Stocker le token dans un volume partagé
echo "$VAULT_TOKEN" > /vault/token.txt
echo "🔑 Token root écrit dans /vault/token.txt"

# Exécuter le script d'import
./start.sh

# Garder le conteneur actif
wait $VAULT_PID
