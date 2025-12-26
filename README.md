# 🚗 Auto Fleet - Système de Location de Véhicules

# Car Rental with Tracking

Application web moderne de gestion de location de véhicules en Tunisie, construite avec React, Node.js, Express, Prisma et PostgreSQL.


![Tech Stack](./src/assets/651c45b1865c51f174a583211861ca76520c7033.png)

## Running the code

## 📋 Table des matières

Run `npm i` to install the dependencies.

- [Fonctionnalités](#-fonctionnalités)

- [Technologies utilisées](#️-technologies-utilisées) Run `npm run dev` to start the development server.

- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
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
car rental/
├── src/                          # Frontend React
│   ├── components/
│   │   ├── admin/               # Composants admin
│   │   ├── auth/                # Authentification
│   │   ├── client/              # Composants client
│   │   ├── direction/           # Composants direction
│   │   ├── ui/                  # Composants UI réutilisables
│   │   └── ...                  # Autres composants
│   ├── contexts/                # Contextes React (Auth, etc.)
│   ├── assets/                  # Images et ressources
│   └── styles/                  # Styles globaux
│
├── backend/                      # Backend Node.js/Express
│   ├── prisma/
│   │   ├── schema.prisma        # Schéma de la base de données
│   │   └── seed.ts              # Script de seed
│   ├── src/
│   │   ├── routes/              # Routes API
│   │   ├── middleware/          # Middlewares (auth, etc.)
│   │   └── server.ts            # Point d'entrée du serveur
│   ├── .env                     # Variables d'environnement
│   └── package.json
│
├── package.json                  # Dépendances frontend
├── tsconfig.json                 # Configuration TypeScript
├── vite.config.ts                # Configuration Vite
└── README.md
```

## 🔌 API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Véhicules

- `GET /api/vehicles` - Liste des véhicules
- `GET /api/vehicles/:id` - Détails d'un véhicule
- `POST /api/vehicles` - Créer un véhicule (admin)
- `PUT /api/vehicles/:id` - Mettre à jour un véhicule (admin)

### Réservations

- `GET /api/bookings` - Liste des réservations (utilisateur connecté)
- `POST /api/bookings` - Créer une réservation
- `PATCH /api/bookings/:id/cancel` - Annuler une réservation

### Stations

- `GET /api/stations` - Liste des stations

### Incidents

- `GET /api/incidents` - Liste des incidents (utilisateur connecté)
- `POST /api/incidents` - Créer un incident

### Utilisateurs (admin)

- `GET /api/users` - Liste des utilisateurs

### Maintenance (admin)

- `GET /api/maintenance` - Liste des maintenances

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
