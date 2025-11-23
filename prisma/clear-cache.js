#!/usr/bin/env node

/**
 * Script pour nettoyer le cache Prisma avant le déploiement
 * Utile pour éviter les conflits lors du changement de provider (MySQL -> PostgreSQL)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Nettoyage du cache Prisma...');

// Supprimer le cache Prisma
const prismaCachePath = path.join(__dirname, '..', 'node_modules', '.prisma');
if (fs.existsSync(prismaCachePath)) {
  fs.rmSync(prismaCachePath, { recursive: true, force: true });
  console.log('✅ Cache Prisma supprimé');
}

// Supprimer le client Prisma généré
const prismaClientPath = path.join(__dirname, '..', 'node_modules', '@prisma', 'client');
if (fs.existsSync(prismaClientPath)) {
  fs.rmSync(prismaClientPath, { recursive: true, force: true });
  console.log('✅ Client Prisma supprimé');
}

console.log('🎉 Cache nettoyé avec succès !');