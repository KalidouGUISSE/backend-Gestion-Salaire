# 🚀 Backend - Système de Gestion des Salaires

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.0+-black.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0+-purple.svg)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](./LICENSE)

## 📋 Description

Une API backend robuste et évolutive pour la gestion des salaires multi-entreprises, développée avec les technologies modernes. Ce système permet de gérer efficacement les employés, les cycles de paie, les bulletins de salaire et les paiements avec une architecture sécurisée et performante.

## ✨ Fonctionnalités

- 🔐 **Support multi-entreprises** avec contrôle d'accès basé sur les rôles
- 👥 **Gestion des employés** complète (CRUD, contrats, photos)
- 💰 **Génération de cycles de paie** et bulletins de salaire PDF
- 💳 **Traitement des paiements** avec reçus PDF
- 📊 **Tableau de bord** avec KPIs et analyses
- 📱 **API RESTful** documentée avec Swagger
- 🧪 **Tests unitaires et d'intégration** complets
- 🐳 **Containerisation Docker** pour un déploiement facile
- 📧 **Notifications par email** pour les bulletins de salaire
- 📷 **Upload de photos** et génération de QR codes

## 🛠️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **MySQL** (version 8.0 ou supérieure)
- **Docker** et **Docker Compose** (optionnel, pour le déploiement containerisé)

## 📦 Installation

### 1. Clonage du dépôt

```bash
git clone <url-du-depot>
cd backend
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Copiez le fichier d'exemple et configurez vos variables :

```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos valeurs :

```env
DATABASE_URL="mysql://user:password@localhost:3306/payroll_db"
JWT_SECRET="votre-secret-jwt-super-securise"
NODE_ENV="development"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="votre-email@gmail.com"
EMAIL_PASS="votre-mot-de-passe-app"
```

### 4. Configuration de la base de données

```bash
# Appliquer les migrations
npm run migrate

# Alimenter la base avec des données de test
npm run db:seed
```

## 🚀 Utilisation

### Développement

```bash
npm run dev
```

L'API sera accessible sur `http://localhost:3000`

### Production

```bash
npm run build
npm start
```

### Docker

```bash
# Construction et lancement
docker-compose up --build

# En arrière-plan
docker-compose up -d
```

## 🧪 Tests

### Exécution de tous les tests

```bash
npm test
```

### Tests avec couverture

```bash
npm run test:coverage
```

### Test d'un fichier spécifique

```bash
npm test -- tests/unit/PaymentService.test.ts
```

### Test de l'API

```bash
npm run test:api
```

## 📚 Documentation API

La documentation Swagger est disponible à l'adresse : `http://localhost:3000/api-docs`

### Exemples d'appels API

#### Création d'un employé

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@entreprise.com",
    "contractType": "CDI",
    "salary": 45000,
    "companyId": 1
  }'
```

#### Création d'un cycle de paie

```bash
curl -X POST http://localhost:3000/api/payruns \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "MONTHLY",
    "periodStart": "2024-01-01T00:00:00.000Z",
    "periodEnd": "2024-01-31T23:59:59.000Z",
    "companyId": 1
  }'
```

#### Génération des bulletins de salaire

```bash
curl -X POST http://localhost:3000/api/payruns/1/generate-payslips \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

#### Enregistrement d'un paiement

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "payslipId": 1,
    "amount": 4200,
    "method": "BANK_TRANSFER",
    "reference": "PAY-2024-001"
  }'
```

## 🏗️ Architecture du Projet

```
backend/
├── src/
│   ├── controllers/          # Contrôleurs de l'API
│   ├── services/            # Logique métier
│   ├── repositories/        # Couche d'accès aux données
│   ├── routes/              # Définition des routes
│   ├── validatorsSchema/    # Validation des données (Zod)
│   ├── middleware/          # Middlewares Express
│   ├── utils/               # Utilitaires (email, QR, PDF)
│   ├── enums/               # Énumérations TypeScript
│   └── prisma/              # Configuration Prisma
├── tests/
│   ├── unit/                # Tests unitaires
│   └── integration/         # Tests d'intégration
├── uploads/                 # Fichiers uploadés (photos, PDFs)
├── .github/workflows/       # CI/CD GitHub Actions
├── Dockerfile               # Configuration Docker
├── docker-compose.yml       # Orchestration des services
├── package.json             # Dépendances et scripts
└── tsconfig.json            # Configuration TypeScript
```

## 🚀 Déploiement

### Variables d'environnement requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion MySQL | `mysql://user:pass@host:3306/db` |
| `JWT_SECRET` | Clé secrète pour JWT | `super-secret-key` |
| `NODE_ENV` | Environnement | `production` |
| `EMAIL_HOST` | Serveur SMTP | `smtp.gmail.com` |
| `EMAIL_USER` | Email expéditeur | `noreply@company.com` |
| `EMAIL_PASS` | Mot de passe email | `app-password` |

### Déploiement avec Docker

```bash
# Construction de l'image
docker build -t payroll-backend .

# Lancement du conteneur
docker run -p 3000:3000 --env-file .env payroll-backend
```

### Déploiement sur Render

Le projet est configuré pour un déploiement facile sur Render avec le fichier `render.yaml`.

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Standards de code

- Utilisez ESLint pour le linting : `npm run lint`
- Respectez les conventions TypeScript
- Ajoutez des tests pour les nouvelles fonctionnalités
- Mettez à jour la documentation si nécessaire

## 📄 Licence

Ce projet est sous licence ISC. Voir le fichier [`LICENSE`](./LICENSE) pour plus de détails.

## 📞 Contact

Pour toute question ou suggestion :

- **Email** : votre-email@domaine.com
- **GitHub Issues** : [Créer une issue](https://github.com/votre-repo/issues)
- **Documentation API** : `http://localhost:3000/api-docs`

---

⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !