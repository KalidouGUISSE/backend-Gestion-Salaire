#!/usr/bin/env ts-node

/**
 * Script de validation de la documentation Swagger
 */

import swaggerSpecs from './src/swagger.js';

interface SwaggerSpec {
  info?: {
    version?: string;
    title?: string;
  };
  paths?: Record<string, any>;
  components?: {
    schemas?: Record<string, any>;
  };
}

async function validateSwagger() {
  try {
    const specs = swaggerSpecs as SwaggerSpec;

    // Vérifier que les specs sont générées correctement
    if (!specs || typeof specs !== 'object') {
      throw new Error('Les spécifications Swagger ne sont pas valides');
    }

    // Vérifier les propriétés essentielles
    if (!specs.info) {
      throw new Error('Informations manquantes dans les specs Swagger');
    }

    if (!specs.paths || Object.keys(specs.paths).length === 0) {
      throw new Error('Aucun chemin d\'API défini dans les specs Swagger');
    }

    if (!specs.components || !specs.components.schemas) {
      throw new Error('Schémas manquants dans les specs Swagger');
    }

    console.log('✅ Documentation Swagger valide');
    console.log(`📊 Version: ${specs.info.version || 'N/A'}`);
    console.log(`📝 Titre: ${specs.info.title || 'N/A'}`);
    console.log(`🛣️  Chemins d'API: ${Object.keys(specs.paths).length}`);
    console.log(`📋 Schémas: ${Object.keys(specs.components.schemas).length}`);

  } catch (error) {
    console.error('❌ Erreur de validation:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

validateSwagger();