# 🎯 Guide de remplissage de la base de données

## ✅ Ce qui a été fait

### 1. **Script Seed créé** (`backend/prisma/seed.ts`)

Le script seed a été complété avec des données réalistes:

- **7 utilisateurs** (2 admins + 5 clients)
- **4 stations** (Tunis, Sfax, Sousse, Monastir)
- **20 véhicules** (différentes catégories: COMPACT, BERLINE, SUV, ELECTRIC)
- **~300 réservations** réparties sur les 6 derniers mois
- **5 incidents**
- **3 maintenances**

### 2. **Données générées intelligemment**

- Réservations distribuées sur 6 mois avec progression
- Prix réalistes par catégorie
- Statuts variés (COMPLETED, ACTIVE, PENDING)
- Dates cohérentes

## 🚀 Comment exécuter le seed

### Méthode 1: Via NPM (Recommandé)

```bash
cd backend
npm run prisma:seed
```

### Méthode 2: Directement avec tsx

```bash
cd backend
npx tsx prisma/seed.ts
```

### Méthode 3: Via Prisma

```bash
cd backend
npx prisma db seed
```

## 🔍 Vérifier les données

### Script de vérification créé (`backend/check-data.ts`)

```bash
cd backend
npx tsx check-data.ts
```

### Ou via Prisma Studio (Interface graphique)

```bash
cd backend
npm run prisma:studio
```

Puis ouvrez votre navigateur à: http://localhost:5555

## 📊 Ce que vous verrez dans le Dashboard Direction

Une fois les données insérées, le dashboard affichera:

### Vue d'ensemble:

- **Revenu et Réservations**: Graphique avec tendances sur 6 mois
- **Rentabilité mensuelle**: Comparaison revenu vs coûts estimés
- **Performance par ville**: Revenus par station
- **Taux d'utilisation**: Occupation des stations

### Analyses:

- **Tendances des réservations**: Évolution quotidienne
- **Performance des véhicules**: Top véhicules par revenus
- **Revenu par catégorie**: Distribution COMPACT, BERLINE, SUV, ELECTRIC
- **Comparaison des villes**: Q1 vs Q2
- **Réservations par jour**: Lundi à Dimanche

## 🔐 Comptes de connexion

Après le seed, utilisez ces comptes pour tester:

### Direction (pour voir le dashboard)

- **Email**: `direction@autofleet.tn`
- **Mot de passe**: `direction123`

### Admin

- **Email**: `parcadmin@autofleet.tn`
- **Mot de passe**: `parcadmin123`

### Client (pour tester réservations)

- **Email**: `ahmed.benali@email.tn`
- **Mot de passe**: `client123`

## 🔄 Réinitialiser les données

Si vous voulez recommencer à zéro:

```bash
cd backend
npm run prisma:seed
```

Le script efface automatiquement toutes les données existantes avant d'insérer les nouvelles.

## ⚠️ En cas de problème

### Si le seed échoue:

1. **Vérifier la connexion DB**:

```bash
cd backend
npx prisma db push
```

2. **Vérifier les variables d'environnement** (`.env`):

```
DATABASE_URL="postgresql://user:password@localhost:5432/autofleet"
```

3. **Générer le client Prisma**:

```bash
cd backend
npx prisma generate
```

4. **Relancer le seed**:

```bash
npm run prisma:seed
```

## 📝 Données générées

Le seed crée automatiquement:

| Table       | Nombre | Détails                          |
| ----------- | ------ | -------------------------------- |
| Users       | 7      | 1 ADMIN, 1 DIRECTION, 5 CLIENTS  |
| Stations    | 4      | Tunis, Sfax, Sousse, Monastir    |
| Vehicles    | 20     | Variété de marques et catégories |
| Bookings    | ~300   | Réparties sur 6 mois             |
| Incidents   | 5      | Associés aux réservations        |
| Maintenance | 3      | Pour véhicules en maintenance    |

## ✅ Vérification finale

1. ✅ Exécuter le seed
2. ✅ Vérifier avec `npx tsx check-data.ts`
3. ✅ Démarrer le backend: `npm run dev`
4. ✅ Démarrer le frontend: `npm run dev` (dans le dossier frontend)
5. ✅ Se connecter avec: `direction@autofleet.tn` / `direction123`
6. ✅ Naviguer vers "Analyses" dans le dashboard Direction

🎉 **Vous devriez maintenant voir tous les graphiques remplis avec des données réelles !**
