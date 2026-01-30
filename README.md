# 🚀 Backend - Gestion de Salaire

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.0+-black.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0+-purple.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Render](https://img.shields.io/badge/Render-Deployed-success.svg)](https://render.com/)

**GitHub Repository**: [https://github.com/KalidouGUISSE/backend-Gestion-Salaire](https://github.com/KalidouGUISSE/backend-Gestion-Salaire)  
**Swagger Documentation**: [https://backend-gestion-salaire.onrender.com/api-docs](https://backend-gestion-salaire.onrender.com/api-docs)

---

## 🎯 Objectif du Projet

### Besoin Métier
Ce système backend répond au besoin critique des entreprises de gérer efficacement leur processus de paie dans un environnement multi-entreprises sécurisé. Il automatise la gestion des employés, le calcul des salaires, la génération des bulletins de paie et le suivi des paiements, réduisant ainsi les erreurs manuelles et améliorant la conformité réglementaire.

### Public Cible
- **Entreprises multi-sites** nécessitant une gestion centralisée des ressources humaines
- **Équipes RH** cherchant à automatiser les processus de paie mensuels
- **Administrateurs système** responsables de la maintenance et de la sécurité des données
- **Développeurs frontend** intégrant l'API dans des applications web/mobile

### Cas d'Usage Concrets
- **Gestion des employés** : CRUD complet avec contrats, photos et données personnelles
- **Calcul automatique des salaires** : Support des différents types de contrats (CDI, CDD, journalier)
- **Génération de bulletins PDF** : Documents officiels avec QR codes pour validation
- **Suivi des paiements** : Historique complet avec reçus et méthodes de paiement multiples
- **Tableaux de bord** : KPIs en temps réel pour la direction

---

## 📋 Description Fonctionnelle

### 🔐 Gestion des Utilisateurs et Authentification
- **Authentification JWT** avec refresh tokens pour une sécurité renforcée
- **Système de rôles** : SUPER_ADMIN, ADMIN, CASHIER, EMPLOYEE
- **Support multi-entreprises** : Isolation des données par entreprise
- **Gestion des sessions** : Expiration automatique et révocation

### 👥 Gestion des Employés
- **CRUD complet** : Création, lecture, mise à jour, suppression
- **Profils détaillés** : Informations personnelles, contrats, photos
- **Types de contrats** : CDI, CDD, HONORAIRE, JOURNALIER
- **Upload de photos** : Stockage sécurisé avec optimisation
- **Génération de QR codes** : Pour validation rapide des présences

### 💰 Gestion des Salaires et Paie
- **Cycles de paie** : Mensuel, hebdomadaire, quotidien
- **Calcul automatique** : Déductions, avantages, taxes
- **Bulletins PDF** : Génération automatique avec mise en page professionnelle
- **Historique complet** : Traçabilité de tous les calculs

### 💳 Gestion des Paiements
- **Méthodes multiples** : Espèces, virement, Orange Money, Wave
- **Suivi en temps réel** : Statuts PARTIAL, PAID, LOCKED
- **Reçus PDF** : Génération automatique avec références
- **Validation QR** : Sécurisation des transactions

### 📊 Tableaux de Bord et Analytics
- **KPIs en temps réel** : Effectifs, masse salariale, paiements
- **Rapports périodiques** : Analyses par entreprise et période
- **Métriques de performance** : Taux de paiement, délais moyens

### 🛡️ Sécurité et Conformité
- **Chiffrement des données sensibles** : Mots de passe, informations bancaires
- **Validation stricte** : Schémas Zod pour toutes les entrées
- **Logs d'audit** : Traçabilité de toutes les actions
- **Protection contre les attaques** : Rate limiting, CORS, helmet

---

## 🛠️ Stack Technique

| Technologie | Version | Justification |
|-------------|---------|---------------|
| **Node.js** | 18+ | Runtime JavaScript performant avec support LTS long terme |
| **TypeScript** | 5.0+ | Typage statique pour la robustesse et la maintenabilité |
| **Express.js** | 5.0+ | Framework minimaliste et extensible pour APIs REST |
| **Prisma** | 6.0+ | ORM moderne avec migration automatique et sécurité des types |
| **PostgreSQL** | 15+ | Base de données relationnelle robuste et ACID compliant |
| **Zod** | 4.1+ | Validation des schémas avec inférence de types TypeScript |
| **JWT** | 9.0+ | Standard d'authentification stateless et sécurisé |
| **Swagger/OpenAPI** | 6.2+ | Documentation automatique et interactive de l'API |
| **Puppeteer** | 24+ | Génération de PDFs haute qualité pour les bulletins |
| **QRCode** | 1.5+ | Génération de codes QR pour validation mobile |
| **Nodemailer** | 7.0+ | Envoi d'emails transactionnels sécurisé |

### Choix Architecturaux
- **Architecture en couches** : Séparation claire des responsabilités (Routes → Controllers → Services → Repositories)
- **Pattern Repository** : Abstraction de l'accès aux données pour la testabilité
- **Validation centralisée** : Schémas Zod réutilisables dans toute l'application
- **Gestion d'erreurs unifiée** : Middleware centralisé pour les réponses d'erreur

---

## 🏗️ Architecture Technique

### Architecture Générale

```mermaid
graph TD
    A[Client HTTP] --> B[Express Router]
    B --> C[Middleware Auth]
    C --> D[Validation Middleware]
    D --> E[Controller Layer]
    E --> F[Service Layer]
    F --> G[Repository Layer]
    G --> H[Prisma Client]
    H --> I[(PostgreSQL Database)]

    J[File Upload] --> K[Multer Middleware]
    K --> L[Storage Service]

    M[Email Service] --> N[Nodemailer]
    O[PDF Service] --> P[Puppeteer]
    Q[QR Service] --> R[QRCode Library]
```

### Organisation du Code

```
backend/
├── src/
│   ├── controllers/          # Gestion des requêtes/réponses HTTP
│   │   ├── AuthController.ts
│   │   ├── EmployeeController.ts
│   │   ├── PayRunController.ts
│   │   └── PaymentController.ts
│   ├── services/            # Logique métier et orchestration
│   │   ├── AuthService.ts
│   │   ├── EmployeeService.ts
│   │   ├── PayRunService.ts
│   │   └── PaymentService.ts
│   ├── repositories/        # Accès aux données (Prisma)
│   │   ├── AuthRepository.ts
│   │   ├── EmployeeRepository.ts
│   │   ├── PayRunRepository.ts
│   │   └── PaymentRepository.ts
│   ├── routes/              # Définition des endpoints REST
│   │   ├── auth.ts
│   │   ├── employees.ts
│   │   ├── payruns.ts
│   │   └── payments.ts
│   ├── validatorsSchema/    # Schémas de validation Zod
│   │   ├── AuthValidator.ts
│   │   ├── EmployeeValidator.ts
│   │   ├── PayRunValidator.ts
│   │   └── PaymentValidator.ts
│   ├── middleware/          # Middlewares Express
│   │   ├── authMiddleware.ts
│   │   └── errorHandler.ts
│   ├── utils/               # Utilitaires transversaux
│   │   ├── emailUtils.ts
│   │   ├── pdfUtils.ts
│   │   ├── qrUtils.ts
│   │   └── responseFormatter.ts
│   ├── enums/               # Énumérations TypeScript
│   │   ├── Role.ts
│   │   ├── ContractType.ts
│   │   └── PaymentMethod.ts
│   └── prisma/              # Configuration base de données
│       ├── client.ts
│       └── seed.ts
├── tests/
│   ├── unit/                # Tests unitaires (Jest)
│   └── integration/         # Tests d'intégration (Supertest)
├── uploads/                 # Fichiers générés/uploadés
│   ├── photos/
│   ├── payslips/
│   ├── qr_codes/
│   └── receipts/
└── screenshots/             # Captures d'écran documentation
```

---

## 📊 Schéma des Données

### Entités Principales

#### 🏢 Company (Entreprise)
- **id**: Identifiant unique
- **name**: Nom de l'entreprise
- **address**: Adresse physique
- **currency**: Devise (XOF par défaut)
- **payPeriodType**: Période de paie (MONTHLY/WEEKLY/DAILY)

#### 👤 User (Utilisateur)
- **id**: Identifiant unique
- **email**: Email unique
- **password**: Mot de passe hashé
- **fullName**: Nom complet
- **role**: Rôle (SUPER_ADMIN/ADMIN/CASHIER/EMPLOYEE)
- **companyId**: Référence entreprise (null pour super-admin)

#### 👷 Employee (Employé)
- **id**: Identifiant unique
- **companyId**: Référence entreprise
- **firstName/lastName**: Nom complet
- **contractType**: Type de contrat (CDI/CDD/HONORAIRE/JOURNALIER)
- **salary**: Salaire (mensuel pour CDI/CDD, taux/jour pour journalier)
- **photos**: Chemin vers photo de profil
- **attendanceCount**: Nombre total de pointages

#### 💰 PayRun (Cycle de Paie)
- **id**: Identifiant unique
- **companyId**: Référence entreprise
- **type**: Type de cycle (MONTHLY/WEEKLY/DAILY)
- **periodStart/End**: Période couverte
- **status**: Statut (DRAFT/APPROVED/CLOSED)
- **totalGross/Net**: Totaux calculés

#### 📄 Payslip (Bulletin de Salaire)
- **id**: Identifiant unique
- **payRunId**: Référence cycle de paie
- **employeeId**: Référence employé
- **gross/deductions/netPayable**: Montants calculés
- **status**: Statut (PENDING/PARTIAL/PAID/LOCKED)
- **pdfPath**: Chemin vers PDF généré

#### 💳 Payment (Paiement)
- **id**: Identifiant unique
- **companyId**: Référence entreprise
- **payslipId**: Référence bulletin (optionnel)
- **amount**: Montant payé
- **method**: Méthode (CASH/BANK_TRANSFER/ORANGE_MONEY/WAVE)
- **receiptPath**: Chemin vers reçu PDF

### Relations
- **Company** 1:N **User** (Une entreprise a plusieurs utilisateurs)
- **Company** 1:N **Employee** (Une entreprise a plusieurs employés)
- **Company** 1:N **PayRun** (Une entreprise a plusieurs cycles de paie)
- **PayRun** 1:N **Payslip** (Un cycle génère plusieurs bulletins)
- **Employee** 1:N **Payslip** (Un employé a plusieurs bulletins)
- **Payslip** 1:N **Payment** (Un bulletin peut avoir plusieurs paiements partiels)

---

## 📡 Routes API

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| **POST** | `/api/auth/login` | Connexion utilisateur | ❌ Public |
| **POST** | `/api/auth/register` | Inscription (admin uniquement) | ✅ JWT |
| **GET** | `/api/auth/me` | Profil utilisateur connecté | ✅ JWT |
| **GET** | `/api/companies` | Liste des entreprises | ✅ JWT (Super-admin) |
| **POST** | `/api/companies` | Créer une entreprise | ✅ JWT (Super-admin) |
| **GET** | `/api/employees` | Liste des employés | ✅ JWT |
| **POST** | `/api/employees` | Créer un employé | ✅ JWT (Admin+) |
| **PUT** | `/api/employees/:id` | Modifier un employé | ✅ JWT (Admin+) |
| **DELETE** | `/api/employees/:id` | Supprimer un employé | ✅ JWT (Admin+) |
| **GET** | `/api/payruns` | Liste des cycles de paie | ✅ JWT |
| **POST** | `/api/payruns` | Créer un cycle de paie | ✅ JWT (Admin+) |
| **POST** | `/api/payruns/:id/generate-payslips` | Générer les bulletins | ✅ JWT (Admin+) |
| **GET** | `/api/payslips` | Liste des bulletins | ✅ JWT |
| **GET** | `/api/payslips/:id/pdf` | Télécharger PDF bulletin | ✅ JWT |
| **GET** | `/api/payments` | Liste des paiements | ✅ JWT |
| **POST** | `/api/payments` | Enregistrer un paiement | ✅ JWT (Cashier+) |
| **GET** | `/api/dashboard/stats` | Statistiques tableau de bord | ✅ JWT |

### Exemples de Requêtes

#### 🔐 Connexion
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "securePassword123"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@company.com",
      "fullName": "Admin User",
      "role": "ADMIN",
      "companyId": 1
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### 👥 Créer un Employé
```bash
POST /api/employees
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@company.com",
  "contractType": "CDI",
  "salary": 45000,
  "companyId": 1
}
```

#### 💰 Créer un Cycle de Paie
```bash
POST /api/payruns
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "type": "MONTHLY",
  "periodStart": "2024-01-01T00:00:00.000Z",
  "periodEnd": "2024-01-31T23:59:59.000Z",
  "companyId": 1
}
```

---

## 📚 Swagger / OpenAPI

L'API est entièrement documentée avec Swagger UI, accessible à l'adresse : [https://backend-gestion-salaire.onrender.com/api-docs](https://backend-gestion-salaire.onrender.com/api-docs)

### Captures d'Écran

#### Interface de Connexion
![Interface de connexion](screenshots/iqpres%20connection.png)

#### Liste des Endpoints
![Liste des endpoints](screenshots/liste%20des%20endpoints.png)

#### Détails des Méthodes
![Détails des méthodes](screenshots/methode%20des%20end%20point.png)

### Fonctionnalités Swagger
- **Documentation interactive** : Test des endpoints directement depuis l'interface
- **Schémas détaillés** : Structure complète des objets JSON
- **Authentification intégrée** : Support du Bearer Token
- **Exemples de requêtes** : Payloads pré-remplis
- **Réponses typées** : Codes HTTP et structures de réponse

---

## ⚙️ Installation et Lancement

### Prérequis
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 ou **yarn** >= 1.22.0
- **PostgreSQL** >= 15.0 (local ou cloud comme Neon)
- **Git** pour le clonage

### 1. Clonage du Dépôt
```bash
git clone https://github.com/KalidouGUISSE/backend-Gestion-Salaire.git
cd backend-Gestion-Salaire
```

### 2. Installation des Dépendances
```bash
npm install
```

### 3. Configuration des Variables d'Environnement
```bash
cp .env.example .env
```

Éditez le fichier `.env` :
```env
# Base de données PostgreSQL (exemple avec Neon)
DATABASE_URL="postgresql://username:password@host:5432/database"

# JWT et sécurité
JWT_SECRET="votre-cle-secrete-jwt-super-secure-ici"
ACCESS_SECRET="cle-pour-access-token"
REFRESH_SECRET="cle-pour-refresh-token"

# Email (pour notifications)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="votre-email@gmail.com"
EMAIL_PASS="votre-mot-de-passe-application"

# Application
NODE_ENV="development"
PORT=3000
BaseUrl="http://localhost:3000"
```

### 4. Configuration de la Base de Données
```bash
# Appliquer les migrations Prisma
npx prisma migrate dev --name init

# Alimenter avec des données de test
npx prisma db seed
```

### 5. Lancement en Développement
```bash
npm run dev
```

L'API sera accessible sur : `http://localhost:3000`  
Documentation Swagger : `http://localhost:3000/api-docs`

### 6. Tests
```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:api

# Tests avec couverture
npm run test:coverage
```

---

## 🏆 Choix Techniques & Bonnes Pratiques

### Architecture en Couches
**Pourquoi ?** Séparation des responsabilités pour une maintenabilité optimale
- **Routes** : Mapping HTTP vers contrôleurs
- **Contrôleurs** : Gestion des requêtes/réponses HTTP
- **Services** : Logique métier et orchestration
- **Repositories** : Abstraction de l'accès données

### Validation Rigoureuse
**Zod schemas** pour validation des entrées :
- **Sécurité** : Prévention des injections et données malformées
- **DX** : Inférence automatique des types TypeScript
- **Performance** : Validation côté serveur avant traitement

### Gestion d'Erreurs Unifiée
**Middleware d'erreur centralisé** :
- **Consistency** : Format uniforme des réponses d'erreur
- **Logging** : Traçabilité des erreurs en production
- **Sécurité** : Masquage des détails sensibles

### Sécurité Renforcée
- **Bcrypt** pour le hashage des mots de passe
- **Helmet** pour les headers de sécurité HTTP
- **CORS** configuré restrictivement
- **Rate limiting** pour prévention des attaques par déni de service
- **Joi/Zod** pour validation des entrées

### Qualité du Code
- **SOLID Principles** : Principes de conception orientée objet
- **DRY (Don't Repeat Yourself)** : Réutilisation du code
- **ESLint + Prettier** : Standards de code consistants
- **Tests unitaires + intégration** : Couverture > 80%

### Performance
- **Prisma query optimization** : Requêtes optimisées et lazy loading
- **File upload streaming** : Gestion efficace des gros fichiers
- **PDF generation async** : Non-bloquant avec Puppeteer
- **Database indexing** : Optimisation des requêtes fréquentes

---

## 🚀 Améliorations Futures

### Fonctionnalités Prévues
- **API GraphQL** : Alternative plus flexible à REST
- **Microservices** : Décomposition en services indépendants
- **Cache Redis** : Accélération des requêtes fréquentes
- **WebSockets** : Notifications temps réel
- **Multi-tenant avancé** : Base de données par tenant
- **IA/ML** : Prédiction des coûts salariaux

### Améliorations Techniques
- **Migration vers Fastify** : Framework plus performant
- **Containerisation avancée** : Kubernetes orchestration
- **Monitoring avancé** : Prometheus + Grafana
- **CI/CD complet** : Tests automatisés + déploiement
- **API versioning** : Gestion des versions d'API
- **Internationalisation** : Support multi-langues

### Performance & Scalabilité
- **Database sharding** : Partitionnement horizontal
- **CDN integration** : Accélération globale
- **Load balancing** : Distribution de charge
- **Database replication** : Haute disponibilité

---

## 👨‍💻 Auteur

**Kalidou Guissé**  
*Développeur Backend Senior*

- **GitHub** : [https://github.com/KalidouGUISSE](https://github.com/KalidouGUISSE)
- **LinkedIn** : [Votre profil LinkedIn]
- **Email** : kalidouguisse16@gmail.com

## 🧪 Swagger – Captures d’écran

### Vue générale
![Swagger UI – Overview](screenshots/swagger-overview.png)

### Exemple d’endpoint
![Swagger UI – Endpoint](screenshots/swagger-endpoints.png)
![Swagger UI – Endpoint](screenshots/swagger-endpoint.png)


### Expertise
- Développement backend Node.js/TypeScript
- Architecture d'APIs REST et GraphQL
- Bases de données PostgreSQL et MongoDB
- DevOps et déploiement cloud
- Méthodologies Agiles et gestion de projet

---

⭐ **Si ce projet vous inspire, n'hésitez pas à lui donner une étoile sur GitHub !**

*Construit avec ❤️ pour simplifier la gestion des salaires en Afrique.*