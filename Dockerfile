# Etape 1 : Build
FROM node:22-alpine AS builder

WORKDIR /app

# Outils de build nécessaires pour la compilation de la librarie bcrypt (dépendance C++)
RUN apk add --no-cache python3 make g++

# Copie des dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie des fichiers du code source
COPY tsconfig.json ./
COPY src/ ./src/
COPY shared/ ./shared/

# Compilation TypeScript
RUN npm run build

# Retrait des dépendances de développement
RUN npm prune --omit=dev

