# Justification du choix du thème — AutoFleet

## 1. Présentation du projet
AutoFleet est une application web dynamique et interactive dédiée à la gestion centralisée d’une flotte de véhicules. L’application vise à connecter plusieurs profils d’utilisateurs (administrateurs, clients, direction) autour d’un système unique, accessible depuis n’importe quel navigateur web, sans installation préalable.

## 2. Pourquoi ce type de solution
Le choix d’une application web répond à des besoins de disponibilité, d’accessibilité et de maintenance simplifiée. Une interface web centralisée permet :

- l’accès universel depuis tout appareil connecté,
- l’absence d’installation locale pour l’utilisateur,
- des mises à jour et un déploiement plus simples pour l’équipe technique,
- la centralisation des données et des règles métiers.

## 3. Choix du thème : gestion autonome de flottes de véhicules
La thématique « gestion autonome de flottes de véhicules » a été retenue en raison de l’évolution rapide du secteur de la mobilité intelligente. Les véhicules autonomes se développent dans les domaines du transport et de la logistique, mais leur exploitation pose encore des challenges : suivi en temps réel, maintenance prédictive, allocation efficace, et gestion des incidents.

AutoFleet propose d’apporter une réponse concrète à ces enjeux en offrant :

- Une solution innovante : digitalisation complète des opérations (réservations, suivi télémétrique, alertes),
- Une solution durable : optimisation de l’utilisation des véhicules et de leur maintenance pour réduire coûts et gaspillages,
- Une solution efficace : centralisation des workflows pour réduire les frictions opérationnelles.

## 4. Dimension pédagogique et compétence développées
Ce thème offre une forte valeur pédagogique pour l’équipe projet puisque sa réalisation couvre :

- la conception d’interfaces web réactives et accessibles,
- la gestion et la modélisation de données (utilisateurs, véhicules, réservations, incidents),
- l’architecture backend (API, authentification, permissions),
- l’intégration de données temps réel et la visualisation (cartographie, télémétrie),
- l’analyse fonctionnelle et la rédaction de procédures opérationnelles.

Ces aspects permettent à l’équipe de développer des compétences variées et concrètes utiles en milieu professionnel.

## 5. Lien avec le public cible
Le projet cible trois profils principaux, et le design fonctionnel a été pensé pour répondre à leurs attentes :

- Clients finaux : expérience simple, rapide et fiable pour réserver un véhicule à proximité. Contraintes pratiques : âge minimal requis (date d’obtention du permis + 2 ans).
- Administrateurs de parc (opérateurs locaux) : outil complet pour gérer la flotte, planifier la maintenance, suivre les incidents et ajuster la capacité des stations.
- Direction AutoFleet : tableau de bord stratégique et rapports périodiques pour le suivi des indicateurs-clés.

## 6. Besoins non-fonctionnels
La forme web dynamique de l’application permet de garantir :

- Centralisation des données et des opérations pour une gestion cohérente,
- Suivi en temps réel pour optimiser l’utilisation des véhicules,
- Expérience utilisateur améliorée (réactivité, notifications, parcours simplifié),
- Évolutivité pour ajouter de nouvelles fonctionnalités (interfaces, intégrations),
- Accessibilité et disponibilité sur tout type d’appareil.

## 7. Besoins fonctionnels (synthèse)

### Pour les clients (utilisateurs finaux)
- Création de compte, authentification et gestion de profil,
- Recherche de véhicules ou de stations par proximité et critères,
- Réservation de véhicules (sélection horaire, durée, options),
- Confirmation, annulation et modification des réservations,
- Paiement et gestion des moyens de paiement,
- Consultation de l’historique de trajets, factures et reçus,
- Signalement d’un incident (bouton SOS / rapport),
- Réception de notifications (confirmation, rappel, retard, incident),
- Notation et commentaires après trajet.

### Pour les administrateurs de parc
- Connexion au tableau de bord d’exploitation,
- Visualisation de la flotte en temps réel (position, autonomie, état technique),
- Acceptation, refus ou réaffectation manuelle des réservations,
- Gestion des véhicules (ajout/modification/suppression) et paramètres,
- Gestion des stations et de leur capacité (ouverture/fermeture, réglage),
- Planification et historique des maintenances,
- Surveillance des alertes techniques et déclenchement d’actions,
- Gestion des comptes locaux et permissions,
- Consultation des statistiques d’exploitation.

### Pour la direction
- Accès à des tableaux de bord globaux (taux d’utilisation, coûts, incidents),
- Consultation et export de rapports périodiques (mensuels/annuels) pour analyses stratégiques.

## 8. Indicateurs de succès
- Taux d’utilisation de la flotte : > 60 %,
- Taux de réservations automatisées : > 75 %,
- Temps moyen de résolution des incidents critiques : < 24 h.

## 9. Contrat minimal (inputs / outputs / succès)
- Inputs : données utilisateurs, réservations, télémétrie des véhicules, incidents,
- Outputs : états de réservation, positions en temps réel, notifications, rapports et statistiques,
- Critères de succès : disponibilité du service, conformité fonctionnelle, rapidité de traitement des incidents.

## 10. Cas limites et contraintes (edge cases)
- Utilisateur sans connexion stable : gestion des erreurs et reprise (offline/timeout),
- Données manquantes ou capteurs défaillants : procédures de tolérance et mode dégradé,
- Surbooking d’une station : règles de réaffectation et notifications aux utilisateurs,
- Réservation frauduleuse : vérification d’identité et historiques de confiance.

## 11. Prochaines étapes recommandées
- Rédiger les spécifications détaillées des API et des modèles de données,
- Prototyper l’interface utilisateur (wireframes + maquettes),
- Mettre en place un POC pour la gestion de réservations et le suivi en temps réel,
- Définir la stratégie de tests (unitaires, intégration, charge) et de déploiement.

---

Fichier généré automatiquement : justification du choix du thème pour le projet AutoFleet.
