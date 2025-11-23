#!/bin/bash

# Script de déploiement pour Render
# Nettoie le cache Prisma et régénère le client

echo "🚀 Début du déploiement..."

# Nettoyer le cache Prisma
echo "🧹 Nettoyage du cache Prisma..."
node prisma/clear-cache.js

# Générer le client Prisma
echo "⚙️ Génération du client Prisma..."
npx prisma generate

# Appliquer les migrations
echo "🗄️ Application des migrations..."
npx prisma migrate deploy

echo "✅ Déploiement terminé avec succès !"