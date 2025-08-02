# --- STAGE 1: Build everything (Debian for compatibility) ---
FROM debian:bookworm-slim as builder

ENV NGINX_VERSION=1.24.0
ENV MODSECURITY_VERSION=v3.0.8
ENV VAULT_VERSION=1.15.2

# Installer dépendances nécessaires pour la compilation
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    wget \
    curl \
    ca-certificates \
    libpcre3-dev \
    libssl-dev \
    zlib1g-dev \
    cmake \
    automake \
    libtool \
    pkg-config \
    libyajl-dev \
    libgeoip-dev \
    libcurl4-openssl-dev \
    libxml2-dev \
    liblmdb-dev \
    libmaxminddb-dev \
    unzip \
    doxygen

# Installer Vault CLI
RUN curl -fsSL https://releases.hashicorp.com/vault/${VAULT_VERSION}/vault_${VAULT_VERSION}_linux_amd64.zip -o vault.zip && \
    unzip vault.zip && mv vault /usr/local/bin/vault && chmod +x /usr/local/bin/vault && rm vault.zip

# Compilation de ModSecurity
WORKDIR /opt
RUN git clone --depth 1 -b ${MODSECURITY_VERSION} https://github.com/SpiderLabs/ModSecurity && \
    cd ModSecurity && \
    git submodule init && git submodule update && \
    ./build.sh && ./configure && make -j$(nproc) && make install

# Télécharger le connecteur nginx
RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git

# Télécharger et compiler NGINX avec le module ModSecurity
RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
    tar zxvf nginx-${NGINX_VERSION}.tar.gz && \
    cd nginx-${NGINX_VERSION} && \
    ./configure --with-compat --with-http_ssl_module --add-dynamic-module=../ModSecurity-nginx && \
    make -j$(nproc) && make install

# --- STAGE 2: Runtime (léger) ---
FROM alpine:3.20

# Installer dépendances runtime
RUN apk add --no-cache \
    pcre \
    openssl \
    zlib \
    libxml2 \
    libcurl \
    yajl \
    geoip \
    lmdb \
    libmaxminddb \
    bash \
    ca-certificates \
    libstdc++ \
    curl

# Copier NGINX et ModSecurity compilés depuis le stage précédent
COPY --from=builder /usr/local/nginx /usr/local/nginx
COPY --from=builder /usr/local/bin/vault /usr/local/bin/vault
COPY --from=builder /usr/local/modsecurity /usr/local/modsecurity
COPY --from=builder /usr/local/lib/libmodsecurity* /usr/local/lib/
COPY --from=builder /usr/lib/x86_64-linux-gnu/libmaxminddb.so* /usr/lib/
COPY --from=builder /usr/lib/x86_64-linux-gnu/liblmdb.so* /usr/lib/

# Copier les fichiers de configuration
COPY modsecurity.conf /etc/nginx/modsec/modsecurity.conf
COPY cors-exclusions.conf /etc/nginx/modsec/cors-exclusions.conf
COPY crs/crs-setup.conf /etc/nginx/modsec/crs-setup.conf
COPY crs/rules/ /etc/nginx/modsec/rules/
COPY ssl /etc/nginx/ssl

# Copier l'entrée
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV PATH="/usr/local/nginx/sbin:$PATH"

EXPOSE 443
ENTRYPOINT ["/entrypoint.sh"]
