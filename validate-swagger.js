#!/usr/bin/env node

/**
 * Script de validation de la documentation Swagger
 */

async function validateSwagger() {
  try {
    // Importer les specs depuis le fichier compilé
    const swaggerSpecs = (await import('./dist/swagger.js')).default;

    // Vérifier que les specs sont générées correctement
    if (!swaggerSpecs || typeof swaggerSpecs !== 'object') {
      throw new Error('Les spécifications Swagger ne sont pas valides');
    }

    // Vérifier les propriétés essentielles
    if (!swaggerSpecs.info) {
      throw new Error('Informations manquantes dans les specs Swagger');
    }

    if (!swaggerSpecs.paths || Object.keys(swaggerSpecs.paths).length === 0) {
      throw new Error('Aucun chemin d\'API défini dans les specs Swagger');
    }

    if (!swaggerSpecs.components || !swaggerSpecs.components.schemas) {
      throw new Error('Schémas manquants dans les specs Swagger');
    }

    console.log('✅ Documentation Swagger valide');
    console.log(`📊 Version: ${swaggerSpecs.info.version || 'N/A'}`);
    console.log(`📝 Titre: ${swaggerSpecs.info.title || 'N/A'}`);
    console.log(`🛣️  Chemins d'API: ${Object.keys(swaggerSpecs.paths).length}`);
    console.log(`📋 Schémas: ${Object.keys(swaggerSpecs.components.schemas).length}`);

  } catch (error) {
    console.error('❌ Erreur de validation:', error.message);
    process.exit(1);
  }
}

validateSwagger();