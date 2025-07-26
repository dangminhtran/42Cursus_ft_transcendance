FROM debian:bookworm-slim

ENV NGINX_VERSION=1.24.0
ENV MODSECURITY_VERSION=v3.0.8

# Dépendances
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
  libfuzzy-dev \
  doxygen \
  liblmdb-dev \
  libmaxminddb-dev \
  && rm -rf /var/lib/apt/lists/*

COPY modsecurity.conf /etc/nginx/modsec/modsecurity.conf
COPY crs/crs-setup.conf /etc/nginx/modsec/crs-setup.conf
COPY crs/rules/ /etc/nginx/modsec/rules/
COPY ssl /etc/nginx/ssl

# Compilation ModSecurity
WORKDIR /opt
RUN git clone --depth 1 -b ${MODSECURITY_VERSION} https://github.com/SpiderLabs/ModSecurity && \
    cd ModSecurity && \
    git submodule init && git submodule update && \
    ./build.sh && ./configure && make -j$(nproc) && make install

# Récupération du connecteur nginx
RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git

# Compilation nginx avec module statique
RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
    tar zxvf nginx-${NGINX_VERSION}.tar.gz && \
    cd nginx-${NGINX_VERSION} && \
    ./configure --with-compat --with-http_ssl_module --add-dynamic-module=../ModSecurity-nginx && \
    make -j$(nproc) && make install

# Copier config NGINX + ModSecurity à l’intérieur si nécessaire via docker-compose
EXPOSE 443
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]
