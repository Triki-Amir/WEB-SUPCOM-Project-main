# Architecture frontend — AutoFleet

But : reproduire fidèlement la maquette Figma et fournir des composants réutilisables, accessibles et faciles à maintenir.

## 1. Résumé

Le frontend sera organisé en composants atomiques (UI), composants métier (domain components) et pages. Nous utiliserons React + TypeScript + Tailwind CSS pour une intégration rapide des tokens de design (couleurs, typographies) exportés depuis Figma.

## 2. Stack recommandée

- React 18 + TypeScript
- Tailwind CSS pour le styling utilitaire et mapping des design tokens
- React Router pour la navigation (si pages multiples)
- Axios pour appels API
- React Query (optionnel) pour la gestion du cache et fetch
- Socket.IO client pour les mises à jour temps réel
- Jest + React Testing Library pour tests unitaires
- Cypress pour tests end-to-end

## 3. Arborescence (extrait)

- src/
  - assets/ # logos, icônes (SVG) exportés depuis Figma
  - components/
    - ui/ # Button, Input, Avatar, Card, Badge, Modal
    - layout/ # Header, Footer, Container
    - home/ # Hero, ServicesGrid, Testimonials
    - client/ # SearchPanel, VehicleCard, BookingDialog
    - admin/ # FleetCard, MaintenancePanel, AlertsTable
    - direction/ # KPICards, ReportsGrid
  - contexts/ # AuthContext, SocketContext
  - hooks/ # useAuth, useSocket, useFetch
  - services/ # api.ts, authService, vehicleService
  - pages/ # HomePage, LoginPage, ClientDashboard, AdminDashboard, DirectionDashboard
  - styles/ # tailwind.css, design-tokens.css (optional)

## 4. Design system / composants

- Tokens : couleurs, spacing, borderRadius, shadow, fonts
- Atomes : Button, Icon, Avatar, Input, Tag
- Molecules : Card (VehicleCard), SearchBar, StatsCard
- Organismes : Header (logo, nav, auth), Footer (links), DashboardGrid

Chaque composant doit fournir des props typées et être testé avec un test simple (render + interaction).

## 5. Header / Footer (spécifique maquette)

Header :

- Logo gauche, liens (Services, À propos, Témoignages, Contact) centrés/droite selon maquette
- Bouton primaire "Commencer" en haut à droite
- Couleurs : arrière-plan blanc, bordure fine et légère (utiliser tokens)
- Composant `Header.tsx` doit accepter `user?: User` pour afficher avatar + nom + bouton déconnexion

Footer :

- Sections : logo + texte descriptif, colonnes de liens, coordonnées
- Fond sombre (token `dark`), texte clair

## 6. Gestion responsive

- Mobile-first : grilles 1 colonne mobile, 2-3 colonnes desktop
- Breakpoints : md (768px), lg (1024px), xl (1280px)

## 7. Accessibilité

- Contrastes vérifiés (WCAG AA pour textes importants)
- Labels pour inputs, aria-\* pour composants interactifs
- Focus visible personnalisé (outline accessible)

## 8. Intégration Figma

Voir `docs/figma_import_steps.md` pour la procédure détaillée (tokens, exports SVG, mapping Tailwind).

## 9. Bonnes pratiques de développement

- Composants petits et testables
- Eviter inline styles sauf pour cas exceptionnels (utiliser classes Tailwind + tokens)
- Utiliser `svgr` pour importer SVG comme composants React
- Centraliser les appels API dans `services/` et typer les réponses

## 10. POC minimal à livrer (MVP frontend)

- Header + Footer + HomePage (Hero + Services grid + Testimonials)
- Login Page (formulaire) connecté à AuthContext mock
- Client dashboard skeleton avec SearchPanel + VehicleCard list (mock data)
- Mapping couleurs & fonts via `tailwind.config.js`

## 11. Checklist de livraison

- [ ] Configuration Tailwind + fonts
- [ ] Import des assets depuis Figma
- [ ] Composants UI atomiques (Button, Input, Avatar)
- [ ] Pages : Home, Login, Client/Admin/Direction skeleton
- [ ] Connexion AuthContext (mock) + route protection
- [ ] Tests unitaires basiques

---

Ce document peut être transformé en ticket GitHub si vous voulez que je génère la structure de fichiers ou des composants stubs automatiquement.
