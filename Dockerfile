FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package pour installer les dépendances
COPY package*.json ./

# Installer toutes les dépendances (y compris dev) pour Prisma
RUN npm ci

# Copier le code source
COPY . .

# Nettoyer le cache Prisma et générer le client
RUN node prisma/clear-cache.js && npx prisma generate

# Appliquer les migrations de base de données
RUN npx prisma migrate deploy

# Compiler TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
