# ----------- STAGE 1: Build Nginx + ModSecurity + Vault -------------
FROM alpine:3.20 AS builder

ENV NGINX_VERSION=1.24.0
ENV MODSECURITY_VERSION=v3.0.8
ENV VAULT_VERSION=1.15.2

# 📦 Dépendances nécessaires à la compilation
RUN apk add --no-cache \
  bash \
  curl \
  git \
  build-base \
  cmake \
  pkgconfig \
  doxygen \
  linux-headers \
  autoconf \
  automake \
  libtool \
  m4 \
  zlib-dev \
  pcre-dev \
  openssl-dev \
  libxml2-dev \
  curl-dev \
  geoip-dev \
  yajl-dev \
  lmdb-dev \
  libmaxminddb-dev \
  libstdc++ \
  unzip

# 🔐 Installation de Vault
RUN curl -fsSL https://releases.hashicorp.com/vault/${VAULT_VERSION}/vault_${VAULT_VERSION}_linux_amd64.zip -o vault.zip && \
    unzip vault.zip && mv vault /usr/local/bin/vault && chmod +x /usr/local/bin/vault && rm vault.zip

# 🔧 Build ModSecurity
WORKDIR /opt
RUN git clone --depth 1 -b ${MODSECURITY_VERSION} https://github.com/SpiderLabs/ModSecurity && \
    cd ModSecurity && \
    git submodule update --init --depth 1 && \
    ./build.sh && ./configure && make -j$(nproc) && make install

# 🔧 Build du connecteur ModSecurity-nginx
RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git

# 🔧 Build de NGINX avec le module dynamique ModSecurity
RUN curl -O http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
    tar zxvf nginx-${NGINX_VERSION}.tar.gz && \
    cd nginx-${NGINX_VERSION} && \
    ./configure --with-compat --with-http_ssl_module --add-dynamic-module=../ModSecurity-nginx && \
    make -j$(nproc) && make install

# ----------- STAGE 2: Image finale minimaliste avec NGINX + ModSecurity + Vault ----------
FROM alpine:3.20

# 📦 Paquets nécessaires à l’exécution
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

# ✅ Copie de NGINX
COPY --from=builder /usr/local/nginx /usr/local/nginx

# ✅ Copie de Vault
COPY --from=builder /usr/local/bin/vault /usr/local/bin/vault

# ✅ Copie des librairies ModSecurity
COPY --from=builder /opt/ModSecurity/src/.libs/libmodsecurity.so* /usr/local/lib/

# ✅ Chargement correct des libs dynamiques
ENV LD_LIBRARY_PATH="/usr/local/lib:$LD_LIBRARY_PATH"
ENV PATH="/usr/local/nginx/sbin:$PATH"

# ✅ Fichiers de configuration (adapter les chemins si nécessaire)
COPY modsecurity.conf /etc/nginx/modsec/modsecurity.conf
COPY cors-exclusions.conf /etc/nginx/modsec/cors-exclusions.conf
COPY crs/crs-setup.conf /etc/nginx/modsec/crs-setup.conf
COPY crs/rules/ /etc/nginx/modsec/rules/
COPY ssl /etc/nginx/ssl

# ✅ Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 443
ENTRYPOINT ["/entrypoint.sh"]
