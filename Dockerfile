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

# Etape 2 : Runner
FROM node:22-alpine AS runner

WORKDIR /app

# Définition de l'environnement de production
ENV NODE_ENV=production

# Création d'un groupe et d'un utilisateur non-root pour la sécurité
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copie du package.json, des dépendances et du build depuis le builder
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Changement de propriétaire des fichiers vers l'utilisateur non-root
RUN chown -R appuser:appgroup /app

# Exécution sous utilisateur non-root
USER appuser

# Exposition du port d'écoute
EXPOSE 3000

# Démarrage du serveur
CMD ["node", "dist/src/serveur.js"]
