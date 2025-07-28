FROM ubuntu:22.04

# Installer dépendances
RUN apt-get update && \
    apt-get install -y curl unzip openssl && \
    apt-get clean

# Installer Vault
ENV VAULT_VERSION=1.15.2
RUN curl -Lo vault.zip https://releases.hashicorp.com/vault/${VAULT_VERSION}/vault_${VAULT_VERSION}_linux_amd64.zip && \
    unzip vault.zip && \
    mv vault /usr/local/bin/vault && \
    rm vault.zip

# Copier les scripts
COPY entrypoint.sh /entrypoint.sh
COPY start.sh /start.sh
RUN chmod +x /entrypoint.sh /start.sh

# Exposer le port de Vault
EXPOSE 8200

ENTRYPOINT ["/entrypoint.sh"]
