# 🚗 Auto Fleet - Système de Location de Véhicules

Application web moderne de gestion de location de véhicules en Tunisie, construite avec React, Node.js, Express, Prisma et PostgreSQL.

![Tech Stack](./src/assets/651c45b1865c51f174a583211861ca76520c7033.png)

## 🚀 Quick Start

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Start backend (in backend directory)
npm run dev          # Runs on http://localhost:5000

# Start frontend (in root directory)
npm run dev          # Runs on http://localhost:3000
```

## 📂 Structure du Projet

Le projet est organisé de manière claire et logique:

```
WEB-SUPCOM-Project/
├── 📁 backend/          # API Backend (Express + Prisma)
├── 📁 src/              # Application Frontend (React)
├── 📁 Documentation/    # Toute la documentation
└── 📁 Configuration/    # Guide de configuration
```

**Pour plus de détails:** Consultez [PROJECT_STRUCTURE.md](./Documentation/PROJECT_STRUCTURE.md)

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#️-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Structure du projet](#-structure-du-projet)
- [Documentation](#-documentation)
- [Comptes de test](#-comptes-de-test)

## ✨ Fonctionnalités

### Espace Client

- 🔐 Inscription et connexion sécurisées
- 🚙 Recherche et réservation de véhicules
- 📅 Gestion des réservations en cours et historique
- 🚨 Déclaration et suivi des incidents
- 📬 Notifications en temps réel
- 👤 Gestion du profil utilisateur

### Espace Administration

- 📊 Tableau de bord avec statistiques
- 🚗 Gestion de la flotte de véhicules
- 📝 Gestion des réservations
- 🔧 Suivi de la maintenance
- 📍 Gestion des stations
- 👥 Gestion des utilisateurs
- 🚨 Gestion des alertes et incidents

### Espace Direction

- 📈 Analytics et rapports détaillés
- 📊 Vue d'ensemble des performances
- 📉 Statistiques financières
- 🎯 Indicateurs clés de performance (KPIs)

## 🛠️ Technologies utilisées

### Frontend

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Composants UI accessibles
- **Framer Motion** - Animations
- **Lucide React** - Icônes
- **Recharts** - Graphiques et visualisations

### Backend

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Typage statique
- **Prisma** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **Bcrypt** - Hachage des mots de passe
- **Zod** - Validation des données

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [PostgreSQL](https://www.postgresql.org/) (v14 ou supérieur)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd "car rental"
```

### 2. Installer les dépendances du frontend

```powershell
npm install
```

### 3. Installer les dépendances du backend

```powershell
cd backend
npm install
```

## ⚙️ Configuration

### 1. Configuration de la base de données

Créez une base de données PostgreSQL :

```sql
CREATE DATABASE car_rental;
```

### 2. Configuration des variables d'environnement

Copiez le fichier `.env.example` vers `.env` dans le dossier `backend` :

```powershell
cd backend
copy .env.example .env
```

Modifiez le fichier `.env` avec vos informations :

```env
DATABASE_URL="postgresql://postgres:votre_password@localhost:5432/car_rental?schema=public"
JWT_SECRET="votre-clé-secrète-jwt"
PORT=5000
NODE_ENV=development
```

### 3. Exécuter les migrations Prisma

```powershell
# Dans le dossier backend
npx prisma generate
npx prisma migrate dev
```

### 4. Peupler la base de données (seed)

```powershell
# Dans le dossier backend
npm run prisma:seed
```

Cette commande créera :

- 3 utilisateurs de test (client, admin, direction)
- 3 stations (Tunis, Sfax, Sousse)
- 6 véhicules
- 2 réservations
- 1 incident
- 1 enregistrement de maintenance
- 2 notifications

## 🎮 Utilisation

### Démarrer le backend

```powershell
cd backend
npm run dev
```

Le serveur API sera accessible sur `http://localhost:5000`

### Démarrer le frontend

Dans un nouveau terminal :

```powershell
# À la racine du projet
npm run dev
```

L'application sera accessible sur `http://localhost:3000` (ou 3001 si 3000 est occupé)

### Ouvrir Prisma Studio (optionnel)

Pour gérer visuellement la base de données :

```powershell
cd backend
npm run prisma:studio
```

## 📁 Structure du projet

```
WEB-SUPCOM-Project/
│
├── backend/                         # Backend (API)
│   ├── src/                         # Backend source code (Express)
│   │   ├── routes/                 # API route handlers
│   │   ├── middleware/             # Express middleware (auth, validation)
│   │   ├── server.ts               # Express server setup
│   │   └── index.ts                # Application entry point
│   ├── prisma/                      # Prisma schema & database seed
│   │   ├── schema.prisma           # Database schema definition
│   │   └── seed.ts                 # Database seeding script
│   ├── package.json                # Backend dependencies
│   └── README.md                   # Backend documentation
│
├── src/                             # Frontend (React – single app)
│   ├── components/                 # UI components (admin, client, shared)
│   │   ├── admin/                  # Admin dashboard components
│   │   ├── client/                 # Client dashboard components
│   │   ├── direction/              # Direction dashboard components
│   │   ├── auth/                   # Authentication components
│   │   ├── ui/                     # Shared UI components
│   │   └── *.tsx                   # Other shared components
│   ├── contexts/                   # React Contexts (AuthContext, etc.)
│   │   └── AuthContext.tsx         # Authentication state management
│   ├── services/                   # API services (api.ts, requests)
│   │   └── api.ts                  # Centralized API client
│   ├── assets/                     # Static assets (images, icons)
│   ├── styles/                     # Global styles
│   ├── App.tsx                     # Root application component
│   ├── main.tsx                    # React entry point
│   └── README.md                   # Frontend documentation
│
├── Documentation/                  # Project documentation
│   ├── INDEX.md                    # Navigation / table of contents
│   ├── ARCHITECTURE.md             # System architecture
│   ├── README.md                   # Main documentation guide
│   ├── architecture_frontend.md    # Frontend architecture details
│   ├── figma_import_steps.md       # Design import workflow
│   ├── justification_du_choix_du_theme.md  # Theme selection
│   ├── README_DEVELOPMENT.md       # Development setup guide
│   ├── Guidelines.md               # Coding guidelines
│   └── Attributions.md             # Credits and attributions
│
├── Configuration/                  # Configuration guide
│   └── README.md                   # Guide to all configuration files
│
├── index.html                      # Vite HTML entry point (root level)
├── package.json                    # Frontend dependencies (root level)
├── vite.config.ts                  # Vite configuration (root level)
├── tsconfig.json                   # TypeScript config (root level)
└── README.md                       # Global project overview (this file)
```

**Navigation simplifiée:**
- `/backend` - Tout le code backend (API, base de données)
- `/src` - Tout le code frontend (composants React, services)
- `/Documentation` - Toute la documentation du projet
- `/Configuration` - Guide des fichiers de configuration (les fichiers réels sont à la racine)
- Racine du projet - Fichiers de configuration (package.json, vite.config.ts, etc.)

## 📚 Documentation

Pour une documentation complète, consultez le dossier `/Documentation`:

- **[Documentation/INDEX.md](./Documentation/INDEX.md)** - Table des matières complète
- **[Documentation/ARCHITECTURE.md](./Documentation/ARCHITECTURE.md)** - Architecture du système
- **[Documentation/README_DEVELOPMENT.md](./Documentation/README_DEVELOPMENT.md)** - Guide de développement
- **[backend/README.md](./backend/README.md)** - Documentation backend spécifique
- **[src/README.md](./src/README.md)** - Documentation frontend spécifique

## 🔌 API Endpoints

Pour la liste complète des endpoints API, consultez la [documentation backend](./backend/README.md#-api-endpoints).

**Endpoints principaux:**
- Authentification (`/api/auth`)
- Véhicules (`/api/vehicles`)
- Réservations (`/api/bookings`)
- Stations (`/api/stations`)
- Incidents (`/api/incidents`)
- Utilisateurs (`/api/users`)
- Maintenance (`/api/maintenance`)

## 👤 Comptes de test

Après le seed, vous pouvez vous connecter avec :

### Client

- **Email:** client@autofleet.tn
- **Mot de passe:** password123

### Administrateur

- **Email:** admin@autofleet.tn
- **Mot de passe:** password123

### Direction

- **Email:** direction@autofleet.tn
- **Mot de passe:** password123

## 🐛 Dépannage

### Le serveur Vite ne démarre pas

- Vérifiez que le port 3000 est libre ou utilisez un autre port
- Supprimez `node_modules` et réinstallez : `npm install`

### Erreurs de connexion à la base de données

- Vérifiez que PostgreSQL est démarré
- Vérifiez les informations dans `.env`
- Assurez-vous que la base de données existe

### Erreurs Prisma

- Exécutez `npx prisma generate` après toute modification du schéma
- Exécutez `npx prisma migrate reset` pour réinitialiser la base de données

## 📝 Scripts disponibles

### Frontend

```powershell
npm run dev          # Démarre le serveur de développement
npm run build        # Compile pour la production
```

### Backend

```powershell
npm run dev                  # Démarre le serveur en mode développement
npm run build                # Compile TypeScript
npm start                    # Démarre le serveur en production
npm run prisma:generate      # Génère le client Prisma
npm run prisma:migrate       # Exécute les migrations
npm run prisma:seed          # Peuple la base de données
npm run prisma:studio        # Ouvre Prisma Studio
```

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Contributeurs

Développé pour le projet Auto Fleet - Location de véhicules en Tunisie.

---

**Note:** Ce projet utilise les technologies modernes HTML5, CSS3, JavaScript (React), Node.js et PostgreSQL comme spécifié dans les exigences.
