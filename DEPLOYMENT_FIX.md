# 🔧 Correction du problème de déploiement PostgreSQL

## Problème
Erreur lors du déploiement sur Render :
```
Error: response status is 400
Invalid `prisma.user.findUnique()` invocation:
error: Error validating datasource `db`: the URL must start with the protocol `mysql://`.
```

## Cause
Render utilise une ancienne version du code où Prisma était configuré pour MySQL, mais la `DATABASE_URL` pointe maintenant vers PostgreSQL.

## Solutions

### Solution 1 : Forcer un nouveau déploiement
1. Poussez tous les changements sur votre repository Git
2. Sur Render, déclenchez un nouveau déploiement manuel
3. Ou supprimez et recréez le service Render

### Solution 2 : Nettoyer le cache Prisma (recommandé)
Les fichiers suivants ont été ajoutés/modifiés pour résoudre ce problème :

#### Fichiers ajoutés :
- `prisma/clear-cache.js` : Script pour nettoyer le cache Prisma
- `deploy.sh` : Script de déploiement complet
- `DEPLOYMENT_FIX.md` : Ce fichier

#### Fichiers modifiés :
- `Dockerfile` : Inclut maintenant le nettoyage du cache et génération Prisma
- `package.json` : Ajout de la commande `deploy`

### Solution 3 : Configuration Render
Dans les paramètres de votre service Render :

1. **Build Command** :
   ```bash
   npm run deploy
   ```

2. **Variables d'environnement** :
   Assurez-vous que `DATABASE_URL` est définie comme :
   ```
   postgresql://username:password@host:port/database
   ```

### Solution 4 : Redémarrage forcé
Si les solutions ci-dessus ne fonctionnent pas :

1. Supprimez le service Render
2. Attendez 5-10 minutes
3. Recréez le service avec le nouveau code

## Vérification
Après déploiement, vérifiez que :
- L'application démarre sans erreurs Prisma
- La connexion à la base PostgreSQL fonctionne
- Les données seed sont présentes

## Commandes utiles
```bash
# Nettoyer le cache local
node prisma/clear-cache.js

# Générer le client Prisma
npx prisma generate

# Tester la connexion
npx prisma migrate deploy

# Script de déploiement complet
npm run deploy