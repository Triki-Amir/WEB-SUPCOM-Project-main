# 🎬 Guide de Démonstration - Tableau de Bord Direction

## 📋 Vue d'ensemble

Cette démonstration montre l'intégration complète entre l'API backend, la base de données PostgreSQL et le tableau de bord Direction avec des **données dynamiques**.

---

## 🚀 Étape 1 : Préparer les données de démonstration

### A. Enrichir la base de données

```bash
cd backend
npx tsx seed-demo-data.ts
```

Ce script ajoute des données réalistes avec des dates appropriées pour montrer l'évolution mois par mois.

### B. Vérifier les données

```bash
npx tsx check-monthly-data.ts
```

Vous verrez les statistiques de comparaison mensuelle.

---

## 🗄️ Étape 2 : Visualiser la base de données avec Prisma Studio

### Lancer Prisma Studio

```bash
cd backend
npx prisma studio
```

Prisma Studio s'ouvrira à `http://localhost:5555`

### Tables à montrer dans la démo :

#### 1. **Table Vehicle** 🚗

- Montrer les 20 véhicules
- Pointer le champ `createdAt` pour montrer que certains sont du mois dernier
- Montrer les différents statuts : AVAILABLE, RENTED, MAINTENANCE

#### 2. **Table User** 👥

- Filtrer par `role = CLIENT` pour voir les 6 clients
- Montrer les dates de création (`createdAt`)
- Expliquer : "5 clients créés le mois dernier, 3 ce mois = +3 clients"

#### 3. **Table Booking** 📅

- Trier par `createdAt` descendant
- Montrer les réservations du mois actuel vs mois dernier
- Pointer les colonnes :
  - `totalPrice` → contribue au revenu
  - `status` → COMPLETED, ACTIVE, PENDING
  - `createdAt` → utilisé pour les comparaisons mensuelles

#### 4. **Table Incident** ⚠️

- Montrer les incidents créés
- Expliquer le lien avec les bookings
- Montrer les statuts : PENDING, RESOLVED

#### 5. **Table Maintenance** 🔧

- Montrer les maintenances programmées et complétées
- Lien avec les véhicules

---

## 🔌 Étape 3 : Explorer l'API Backend

### Démarrer le backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Routes à présenter :

#### 1. **GET /api/analytics/dashboard**

Retourne les statistiques globales :

```json
{
  "vehicles": {
    "total": 20,
    "available": 15,
    "rented": 3,
    "maintenance": 2,
    "utilizationRate": "15.00"
  },
  "bookings": {
    "total": 234,
    "active": 2,
    "completed": 200
  },
  "revenue": {
    "total": 169968.0
  },
  "users": {
    "total": 6
  },
  "incidents": {
    "open": 1
  }
}
```

#### 2. **GET /api/analytics/monthly-changes** ⭐ NOUVEAU

**C'est la route clé pour votre démo !** Elle calcule automatiquement les changements :

```json
{
  "vehicles": {
    "change": 20,
    "changeText": "+20 ce mois",
    "trend": "up"
  },
  "users": {
    "change": 3,
    "changeText": "+3 ce mois",
    "trend": "up"
  },
  "revenue": {
    "changePercent": -46.0,
    "changeText": "-46.0%",
    "trend": "down"
  },
  "activeBookings": {
    "changePercent": 0.0,
    "changeText": "+0.0%",
    "trend": "up"
  },
  "totalBookings": {
    "change": -8,
    "changeText": "-8 ce mois",
    "trend": "down"
  },
  "incidents": {
    "change": -1,
    "changeText": "-1 vs mois dernier",
    "trend": "down"
  }
}
```

#### 3. **GET /api/analytics/revenue/monthly-trends**

Retourne les tendances sur 6 mois pour les graphiques

#### 4. **GET /api/analytics/stations/statistics**

Statistiques par station pour le tableau des performances

---

## 🎨 Étape 4 : Démonstration du Dashboard Direction

### A. Se connecter

```
Email: direction@autofleet.tn
Password: direction123
```

### B. Tableau de bord - Vue d'ensemble

#### 1. **Cartes KPI** (en haut)

Montrer **chaque carte** et expliquer :

**Flotte totale** 🚗

- Valeur : 20 véhicules
- Changement : **+20 ce mois** (vert ↗)
- Source : `vehicles.change` de l'API

**Clients actifs** 👥

- Valeur : 6
- Changement : **+3 ce mois** (vert ↗)
- Source : `users.change` de l'API

**Revenu total** 💰

- Valeur : 169968.00 TND
- Changement : **-46.0%** (rouge ↘)
- Source : `revenue.changePercent` de l'API
- Expliquer : "Baisse car moins de réservations ce mois"

**Réservations actives** 📊

- Valeur : 2
- Changement : **+0%**
- Source : `activeBookings.changePercent` de l'API

**Total réservations** 📍

- Valeur : 234
- Changement : **-8 ce mois**
- Source : `totalBookings.change` de l'API

**Incidents** ⚠️

- Valeur : 1
- Changement : **-1 vs mois dernier** (vert ↘ car moins d'incidents est bon)
- Source : `incidents.change` de l'API

#### 2. **Graphiques**

- **Revenu et Réservations** : Courbes sur 6 mois
- **Rentabilité mensuelle** : Barres comparant revenus et coûts
- **Performance des véhicules** : Top 3 véhicules par revenu
- **Performance par ville** : Comparaison entre villes

---

## 🎯 Étape 5 : Démontrer la Correspondance

### Script de démonstration :

1. **Ouvrir Prisma Studio** (localhost:5555)

   - Aller dans `Booking`
   - Filtrer les réservations de décembre 2025
   - Compter : "Vous voyez 23 réservations ce mois"

2. **Ouvrir le Dashboard** (localhost:3000)

   - Montrer la carte "Total réservations" : **-8 ce mois**
   - Expliquer : "23 ce mois vs 31 le mois dernier = -8"

3. **Faire un curl sur l'API** :

   ```bash
   curl http://localhost:5000/api/analytics/monthly-changes \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

   - Montrer la réponse JSON avec les calculs

4. **Retourner à Prisma Studio**
   - Table `Vehicle` → Compter les véhicules
   - Dashboard → Voir le même nombre
   - API → Confirmer dans la réponse

---

## 📝 Points clés à mentionner dans la vidéo

### Architecture

✅ **Backend** : Express.js + TypeScript + Prisma
✅ **Base de données** : PostgreSQL
✅ **Frontend** : React + TypeScript + Recharts
✅ **API RESTful** avec authentification JWT

### Fonctionnalités démontrées

✅ Calculs dynamiques en temps réel depuis la base
✅ Comparaisons mensuelles automatiques
✅ Agrégations complexes (revenus, taux d'occupation)
✅ Visualisations interactives
✅ Gestion des rôles (Direction)

### Données dynamiques (NON hard-codées)

✅ Tous les changements (vert/rouge) viennent de la DB
✅ Calculs de pourcentages automatiques
✅ Détection de tendances (up/down)
✅ Comparaison mois actuel vs mois précédent

---

## 🔧 Commandes utiles

```bash
# Backend
cd backend
npm run dev              # Démarrer le serveur
npx prisma studio        # Visualiser la DB
npx tsx seed-demo-data.ts   # Enrichir les données
npx tsx check-monthly-data.ts  # Vérifier les stats

# Frontend
cd frontend
npm run dev              # Démarrer l'interface

# Base de données
npx prisma db push       # Synchroniser le schéma
npx prisma db seed       # Seed initial
```

---

## 🎥 Structure suggérée de la vidéo

1. **Introduction** (30s)

   - Présentation du projet
   - Architecture globale

2. **Base de données** (2min)

   - Ouvrir Prisma Studio
   - Parcourir les tables
   - Montrer les données et dates

3. **API Backend** (2min)

   - Montrer le code de la route `/monthly-changes`
   - Faire des requêtes curl
   - Expliquer les calculs

4. **Dashboard** (3min)

   - Se connecter
   - Parcourir chaque KPI
   - Montrer les graphiques
   - Expliquer la correspondance avec la DB

5. **Démonstration de correspondance** (2min)

   - DB → API → Dashboard
   - Prouver que tout est dynamique

6. **Conclusion** (30s)
   - Récapitulatif
   - Technologies utilisées

---

## ✨ Bonus : Changer les données en direct

Pour rendre la démo encore plus impressionnante :

```bash
# Créer une nouvelle réservation via Prisma Studio
# Puis rafraîchir le dashboard
# Montrer que les stats se mettent à jour!
```

Bonne chance pour votre démo ! 🚀
