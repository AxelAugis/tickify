# Dockerfile pour Symfony Backend
FROM php:8.3-cli-alpine

# Installation des dépendances système
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    oniguruma-dev \
    icu-dev \
    libzip-dev \
    postgresql-dev

# Installation des extensions PHP
RUN docker-php-ext-configure intl
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    mbstring \
    xml \
    gd \
    intl \
    zip \
    opcache

# Installation de Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configuration du répertoire de travail
WORKDIR /var/www/html

# Copie des fichiers de configuration Composer
COPY composer.json composer.lock ./

# Installation des dépendances PHP
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copie du code source
COPY . .

# Configuration des permissions
RUN chown -R www-data:www-data /var/www/html/var
RUN chmod -R 775 /var/www/html/var

# Exposition du port
EXPOSE 8000

# Commande par défaut - serveur Symfony
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]