# 📚 Documentation API - Système de Gestion des Salaires

## Vue d'ensemble

Cette API REST complète permet de gérer un système de paie d'entreprise avec authentification JWT, gestion des employés, cycles de paie, bulletins de salaire, paiements et suivi des présences.

## 🚀 Démarrage rapide

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd payroll-management-api

# Installer les dépendances
npm install

# Configuration de la base de données
cp .env.example .env
# Éditer .env avec vos paramètres

# Migration de la base de données
npm run migrate

# Seed de données de test (optionnel)
npm run db:seed

# Démarrer en mode développement
npm run dev
```

### Accès à la documentation

Une fois le serveur démarré, accédez à :
- **API** : http://localhost:3000
- **Documentation Swagger** : http://localhost:3000/api-docs

## 🔐 Authentification

L'API utilise l'authentification JWT avec tokens d'accès et de rafraîchissement.

### Connexion

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "password123"
}
```

**Réponse réussie :**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@company.com",
    "role": "ADMIN",
    "companyId": 1
  }
}
```

### Utilisation du token

Incluez le token dans l'en-tête Authorization :
```
Authorization: Bearer <access_token>
```

## 👥 Gestion des Utilisateurs

### Rôles utilisateur
- **SUPER_ADMIN** : Accès à toutes les entreprises
- **ADMIN** : Gestion d'une entreprise spécifique
- **CASHIER** : Gestion des paiements
- **EMPLOYEE** : Accès limité aux propres données

### Endpoints principaux

#### Lister les utilisateurs
```bash
GET /users?page=1&limit=10
Authorization: Bearer <token>
```

#### Créer un utilisateur
```bash
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newuser@company.com",
  "password": "password123",
  "fullName": "New User",
  "role": "ADMIN",
  "companyId": 1
}
```

## 🏢 Gestion des Entreprises

### Créer une entreprise
```bash
POST /company
Authorization: Bearer <token_super_admin>
Content-Type: application/json

{
  "name": "Entreprise ABC",
  "address": "123 Rue de la Paix, Dakar",
  "currency": "XOF",
  "payPeriodType": "MONTHLY"
}
```

### Lister les entreprises
```bash
GET /company?page=1&limit=10
```

## 👷 Gestion des Employés

### Créer un employé
```bash
POST /employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@company.com",
  "contractType": "FIXE",
  "salary": 500000,
  "position": "Développeur",
  "hireDate": "2024-01-15"
}
```

### Télécharger une photo
```bash
POST /employees/{id}/photos
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Fichier image (JPEG, PNG, WebP, max 5MB)
```

## 💰 Gestion des Cycles de Paie

### Créer un cycle de paie
```bash
POST /payruns
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Paie Janvier 2024",
  "type": "MONTHLY",
  "periodStart": "2024-01-01",
  "periodEnd": "2024-01-31"
}
```

### Générer les bulletins
```bash
POST /payruns/{id}/generate-payslips
Authorization: Bearer <token>
```

### Approuver un cycle
```bash
PATCH /payruns/{id}/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED"
}
```

## 💳 Gestion des Paiements

### Enregistrer un paiement
```bash
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "payslipId": 1,
  "amount": 500000,
  "method": "BANK_TRANSFER",
  "reference": "TRF20240115001"
}
```

### Générer un reçu PDF
```bash
POST /payments/generate-receipt
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIds": [1, 2, 3]
}
```

### Valider un paiement QR
```bash
POST /payments/validate-qr
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentId": 1,
  "qrToken": "abc123def456"
}
```

## ⏰ Gestion des Présences

### Scanner un QR code
```bash
POST /attendance/scan
Authorization: Bearer <token>
Content-Type: application/json

{
  "qrToken": "abc123def456"
}
```

### Rapport des présences
```bash
GET /attendance/report?startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10
Authorization: Bearer <token>
```

### Exporter en CSV
```bash
GET /attendance/export?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

## 📊 Tableau de Bord

### KPIs principaux
```bash
GET /dashboard/kpis
Authorization: Bearer <token>
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "totalPayroll": 15000000,
    "totalPaid": 12000000,
    "totalOutstanding": 3000000,
    "activeEmployees": 45,
    "evolution": [
      {
        "month": "2024-01",
        "gross": 15000000,
        "paid": 12000000,
        "outstanding": 3000000
      }
    ]
  }
}
```

## 🧪 Tests automatiques

### Exécuter tous les tests API
```bash
npm run test:api
```

Ce script teste automatiquement :
- ✅ Accessibilité de la documentation Swagger
- 🔐 Authentification (login/refresh)
- 🏢 CRUD des entreprises
- 👥 CRUD des utilisateurs
- 👷 CRUD des employés
- 💰 Gestion des cycles de paie
- 💳 Gestion des paiements
- 📊 KPIs du tableau de bord
- ⏰ Fonctionnalités de présence

### Rapport de test

Le script génère un fichier `api-test-report.json` avec les résultats détaillés.

## 🚀 Déploiement sur Render

### Prérequis

1. **Compte Render** : https://render.com
2. **Base de données MySQL** (Render ou externe)
3. **Variables d'environnement**

### Variables d'environnement

```bash
NODE_ENV=production
DATABASE_URL=mysql://user:password@host:port/database
ACCESS_SECRET=votre_secret_access_jwt
REFRESH_SECRET=votre_secret_refresh_jwt
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
```

### Déploiement

1. **Connecter le repository Git**
2. **Configuration du service web** :
   - **Runtime** : Node
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
   - **Health Check Path** : `/api-docs`

3. **Configuration de la base de données** :
   - Créer une base MySQL sur Render
   - Copier la DATABASE_URL

4. **Variables d'environnement** :
   - Définir toutes les variables requises
   - Générer des secrets JWT sécurisés

5. **Migration de la base de données** :
   ```bash
   npm run migrate:deploy
   npm run db:seed  # Optionnel
   ```

### Fichiers de configuration

- `render.yaml` : Configuration Render Blueprint
- `package.json` : Scripts de build et démarrage
- `.env.example` : Template des variables d'environnement

## 📋 Structure du projet

```
├── src/
│   ├── controllers/     # Logique métier
│   ├── routes/         # Définition des routes API
│   ├── services/       # Services métier
│   ├── repositories/   # Accès aux données
│   ├── middleware/     # Middleware Express
│   ├── validators/     # Validation des données
│   ├── utils/          # Utilitaires
│   ├── swagger.ts      # Configuration Swagger
│   └── index.ts        # Point d'entrée
├── prisma/
│   ├── schema.prisma   # Schéma de base de données
│   └── migrations/     # Migrations Prisma
├── uploads/            # Fichiers téléchargés
├── test-api.js         # Tests automatiques
├── render.yaml         # Configuration Render
└── package.json        # Dépendances et scripts
```

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev              # Démarrage en mode développement
npm run build            # Compilation TypeScript
npm start                # Démarrage en production

# Base de données
npm run migrate          # Migration en développement
npm run migrate:deploy   # Migration en production
npm run db:seed          # Seed des données
npm run db:reset         # Reset complet de la DB

# Tests
npm test                 # Tests unitaires
npm run test:api         # Tests API automatiques

# Qualité du code
npm run lint             # Vérification ESLint
npm run lint:fix         # Correction automatique
npm run swagger:validate # Validation Swagger
```

## 📊 Modèles de données

### Relations principales

```
Company (1) ──── (N) User
   │
   ├── (N) Employee
   │     └── (1) EmployeeProfile (QR codes)
   │
   ├── (N) PayRun
   │     └── (N) Payslip
   │          └── (N) Payment
   │
   └── (N) Attendance
```

### Enums

- **Role** : SUPER_ADMIN, ADMIN, CASHIER, EMPLOYEE
- **ContractType** : JOURNALIER, FIXE, HONORAIRE
- **PayRunType** : MONTHLY, WEEKLY, DAILY
- **PayRunStatus** : DRAFT, APPROVED, CLOSED
- **PayslipStatus** : PENDING, PARTIAL, PAID, LOCKED
- **PaymentMethod** : CASH, BANK_TRANSFER, ORANGE_MONEY, WAVE, OTHER
- **AttendanceType** : ENTRY, EXIT

## 🔒 Sécurité

### Authentification
- JWT avec tokens d'accès (15min) et rafraîchissement (7 jours)
- Cookies HttpOnly pour les tokens de rafraîchissement
- Hachage bcrypt des mots de passe

### Autorisation
- Middleware d'authentification sur toutes les routes protégées
- Vérification des rôles utilisateur
- Contrôle d'accès basé sur l'entreprise

### Validation
- Zod pour la validation des données d'entrée
- Sanitisation automatique des entrées
- Gestion d'erreurs centralisée

## 📈 Monitoring et logs

### Logs d'application
- Logs détaillés des opérations importantes
- Logs d'erreur avec stack traces
- Logs de performance pour les requêtes lentes

### Métriques
- Comptes d'utilisateurs actifs
- Statistiques de paiement
- Taux de présence des employés

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de connexion DB**
   ```bash
   # Vérifier la DATABASE_URL
   echo $DATABASE_URL

   # Tester la connexion
   npx prisma db push --preview-feature
   ```

2. **Token JWT expiré**
   ```bash
   POST /auth/refresh
   # Avec le cookie refreshToken
   ```

3. **Erreur de validation**
   - Vérifier le format des données selon la doc Swagger
   - Utiliser les exemples fournis

4. **Problème de CORS**
   - Vérifier les origines autorisées dans `src/index.ts`

### Support

- 📧 **Email** : support@yallabakhna.com
- 📚 **Documentation** : http://localhost:3000/api-docs
- 🧪 **Tests** : `npm run test:api`

---

## 📝 Notes de version

### v1.0.0
- ✅ API complète de gestion des salaires
- ✅ Authentification JWT
- ✅ Gestion des employés et entreprises
- ✅ Cycles de paie et bulletins
- ✅ Système de paiements avec QR codes
- ✅ Suivi des présences
- ✅ Tableau de bord avec KPIs
- ✅ Documentation Swagger complète
- ✅ Tests automatiques
- ✅ Déploiement Render configuré

---

*Documentation générée automatiquement - Dernière mise à jour : $(date)*