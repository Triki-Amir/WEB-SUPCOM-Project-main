# AutoFleet — Démarrage local (Windows PowerShell)

Ce dépôt contient un starter frontend (React + Vite + Tailwind) et un backend (Node.js + Express).

1. Frontend

- Aller dans le dossier frontend

```powershell
cd frontend
npm install
npm run dev
```

2. Backend

- Aller dans le dossier backend et installer les dépendances

```powershell
cd backend
npm install
# créer un fichier .env avec DATABASE_URL et PORT (voir .env.example)
npm run dev
```

Notes :

- Tailwind et Vite sont configurés de base ; ajoutez vos assets SVG exportés depuis Figma dans `frontend/src/assets/`.
- Remplacez les endpoints mock dans `backend/src/index.ts` par des routes réelles connectées à PostgreSQL (Prisma ou pg).

Pour toute aide sur la suite (création de composants complets, API, mise à jour tokens Figma -> tailwind), demandez et je génère les fichiers correspondants.
