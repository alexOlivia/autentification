# User Stories - Restaurant Service

## 📋 Vue d'ensemble

Ce document contient toutes les user stories du **Restaurant Service** organisées par persona et priorité.

---

## 🎯 Personas

### 1. **Client** - Utilisateur cherchant à réserver une table
### 2. **Commerçant Restaurateur** - Propriétaire/gérant de restaurant
### 3. **Admin Plateforme** - Administrateur système
### 4. **Booking Service** - Service interne (API-to-API)

---

## 🔴 Priorité HAUTE - MVP

### US-R001 : Création de restaurant par le commerçant
**En tant que** commerçant restaurateur  
**Je veux** créer le profil de mon restaurant sur la plateforme  
**Afin de** proposer mes services aux clients et gérer mes réservations  

**Critères d'acceptation :**
- [ ] Je peux renseigner les informations de base (nom, adresse, téléphone)
- [ ] Je choisis le type de cuisine (African, Européen, Asiatique, Fusion, etc.)
- [ ] Je définis la capacité totale du restaurant
- [ ] Je configure si j'accepte les réservations en ligne
- [ ] Je définis la durée moyenne d'un repas (ex: 90 minutes)
- [ ] Le système génère un ID unique pour mon restaurant
- [ ] Je reçois une confirmation par email/SMS

**Valeur métier :** CRITIQUE - Point d'entrée obligatoire  
**Estimation :** 5 points  
**Dépendances :** Auth Service (commercantId)

---

### US-R002 : Gestion des tables du restaurant
**En tant que** commerçant restaurateur  
**Je veux** ajouter et configurer les tables de mon restaurant  
**Afin de** gérer précisément ma capacité d'accueil  

**Critères d'acceptation :**
- [ ] Je peux ajouter une table avec un numéro unique (ex: "T1", "Terrasse-5")
- [ ] Je définis la capacité minimale et maximale (ex: 2-6 personnes)
- [ ] Je choisis la forme (Ronde, Carrée, Rectangulaire, Haute/Bar)
- [ ] J'assigne la table à une zone spécifique
- [ ] Je peux indiquer si c'est une table fumeur (contexte africain)
- [ ] Je peux mettre une table "hors service" temporairement
- [ ] Je peux modifier/supprimer une table
- [ ] Le système empêche la suppression si des réservations futures existent

**Valeur métier :** CRITIQUE - Gestion de l'inventaire  
**Estimation :** 8 points  
**Dépendances :** US-R001, US-R003

---

### US-R003 : Organisation en zones de salle
**En tant que** commerçant restaurateur  
**Je veux** organiser mon restaurant en différentes zones  
**Afin de** offrir des ambiances variées et gérer les préférences clients  

**Critères d'acceptation :**
- [ ] Je peux créer des zones (Intérieur, Terrasse, VIP, Bar, Jardin, Salle privée)
- [ ] Je nomme chaque zone (ex: "Terrasse ombragée", "Salle climatisée")
- [ ] Je définis la capacité totale de la zone
- [ ] J'indique si la zone est extérieure ou intérieure
- [ ] Je précise si la zone a la climatisation
- [ ] Je peux réorganiser l'ordre d'affichage des zones
- [ ] Le système calcule automatiquement la capacité totale du restaurant

**Valeur métier :** HAUTE - Améliore l'expérience client  
**Estimation :** 5 points  
**Dépendances :** US-R001

---

### US-R004 : Configuration des périodes de service
**En tant que** commerçant restaurateur  
**Je veux** définir mes horaires de service (déjeuner, dîner, etc.)  
**Afin de** que les clients puissent réserver aux bonnes heures  

**Critères d'acceptation :**
- [ ] Je configure le petit-déjeuner (ex: 7h-11h)
- [ ] Je configure le déjeuner (ex: 12h-16h)
- [ ] Je configure le dîner (ex: 19h-23h)
- [ ] Je peux ajouter des périodes personnalisées (Brunch, Goûter)
- [ ] Je sélectionne les jours d'activité pour chaque période
- [ ] Le système empêche les chevauchements d'horaires
- [ ] Je peux désactiver temporairement une période

**Valeur métier :** HAUTE - Gestion des disponibilités  
**Estimation :** 5 points  
**Dépendances :** US-R001

---

### US-R005 : Recherche de table disponible (Client)
**En tant que** client  
**Je veux** chercher une table disponible pour une date/heure et nombre de personnes  
**Afin de** planifier ma sortie au restaurant  

**Critères d'acceptation :**
- [ ] Je saisis la date souhaitée
- [ ] Je choisis l'heure (créneau)
- [ ] J'indique le nombre de personnes (1-20+)
- [ ] Le système affiche les tables disponibles avec leurs zones
- [ ] Je peux filtrer par type de zone (Terrasse, VIP, Intérieur)
- [ ] Je vois la capacité de chaque table proposée
- [ ] Si aucune table exacte, le système propose des alternatives (combinaison de tables)
- [ ] Le temps de recherche ne dépasse pas 2 secondes

**Valeur métier :** CRITIQUE - Fonctionnalité cœur client  
**Estimation :** 13 points (complexité algorithme)  
**Dépendances :** US-R002, US-R004, Booking Service

---

### US-R006 : Vérification de disponibilité (API interne)
**En tant que** Booking Service  
**Je veux** vérifier la disponibilité d'une table avant de créer une réservation  
**Afin de** éviter les doubles réservations  

**Critères d'acceptation :**
- [ ] L'endpoint `/api/restaurants/{id}/availability` est disponible
- [ ] Je passe en paramètres : restaurantId, date, heure, nombre de personnes, durée
- [ ] Le système vérifie les chevauchements avec réservations existantes
- [ ] Le système prend en compte la durée moyenne du repas + temps de rotation
- [ ] La réponse indique : `{ available: boolean, tableIds: [], suggestions: [] }`
- [ ] Le système gère les réservations simultanées (race condition) avec locks
- [ ] Le cache Redis est utilisé pour accélérer les vérifications fréquentes

**Valeur métier :** CRITIQUE - Intégrité des données  
**Estimation :** 8 points  
**Dépendances :** US-R005, Redis, Booking Service

---

## 🟡 Priorité MOYENNE

### US-R007 : Réservation complète du restaurant (Événements)
**En tant que** client organisant un grand événement (mariage, baptême)  
**Je veux** privatiser entièrement le restaurant  
**Afin de** accueillir mes nombreux invités dans un lieu dédié  

**Critères d'acceptation :**
- [ ] Je peux demander une réservation complète (checkbox)
- [ ] Le système vérifie que le restaurant accepte ce type de réservation
- [ ] Je précise le nombre d'invités (jusqu'à la capacité max événement)
- [ ] Le système affiche le tarif forfaitaire de privatisation
- [ ] Le restaurant peut définir des conditions spéciales (durée, animations)
- [ ] Le système bloque toutes les tables pour la période choisie
- [ ] Le commerçant reçoit une notification spéciale pour validation manuelle

**Valeur métier :** HAUTE - Contexte africain, forte valeur ajoutée  
**Estimation :** 13 points  
**Dépendances :** US-R001, US-R005, Notification Service

---

### US-R008 : Visualisation du plan de salle
**En tant que** commerçant restaurateur  
**Je veux** positionner mes tables sur un plan 2D de ma salle  
**Afin de** visualiser l'occupation en temps réel  

**Critères d'acceptation :**
- [ ] Je peux définir les coordonnées (x, y) de chaque table
- [ ] L'interface affiche un plan de salle interactif (drag & drop)
- [ ] Les tables occupées apparaissent en rouge, disponibles en vert, réservées en orange
- [ ] Je peux zoomer/dézoomer sur le plan
- [ ] Le plan se rafraîchit automatiquement (WebSocket)
- [ ] Je peux sauvegarder différentes configurations (été/hiver)

**Valeur métier :** MOYENNE - Améliore gestion opérationnelle  
**Estimation :** 13 points (UI complexe)  
**Dépendances :** US-R002, US-R003, WebSocket

---

### US-R009 : Suggestion de créneaux alternatifs
**En tant que** client  
**Je veux** recevoir des suggestions si mon créneau souhaité est complet  
**Afin de** trouver rapidement une alternative  

**Critères d'acceptation :**
- [ ] Si aucune table disponible à l'heure demandée, le système propose :
  - [ ] Créneaux +/- 30 minutes (ex: 19h demandé → proposer 18h30, 19h30, 20h)
  - [ ] Autres zones disponibles (ex: terrasse si intérieur complet)
  - [ ] Tables légèrement plus grandes (optimisation occupation)
- [ ] Les suggestions sont triées par proximité avec la demande initiale
- [ ] Maximum 5 suggestions affichées
- [ ] Je peux cliquer pour réserver directement une alternative

**Valeur métier :** MOYENNE - Améliore taux de conversion  
**Estimation :** 8 points  
**Dépendances :** US-R005, US-R006

---

### US-R010 : Statistiques et occupation
**En tant que** commerçant restaurateur  
**Je veux** voir des statistiques sur l'occupation de mon restaurant  
**Afin de** optimiser ma gestion et mes revenus  

**Critères d'acceptation :**
- [ ] Dashboard avec taux d'occupation par période (déjeuner/dîner)
- [ ] Graphiques sur les 7 derniers jours, 30 jours, année
- [ ] Tables les plus/moins réservées
- [ ] Zones préférées des clients
- [ ] Heures de pointe identifiées
- [ ] Taux de rotation moyen par table
- [ ] Export des données en CSV/Excel

**Valeur métier :** MOYENNE - Aide à la décision  
**Estimation :** 13 points  
**Dépendances :** US-R001-R006, Service Analytics

---

## 🟢 Priorité BASSE - Améliorations futures

### US-R011 : Configuration par saison
**En tant que** commerçant restaurateur  
**Je veux** adapter ma configuration selon les saisons  
**Afin de** gérer les variations (terrasse été/hiver)  

**Critères d'acceptation :**
- [ ] Je peux créer des profils saisonniers (Saison des pluies, Saison sèche)
- [ ] Je définis quelles zones sont actives par saison
- [ ] Le système active automatiquement selon les dates configurées
- [ ] Je peux basculer manuellement entre profils

**Valeur métier :** BASSE - Nice to have  
**Estimation :** 5 points  
**Dépendances :** US-R003

---

### US-R012 : Combinaison intelligente de tables
**En tant que** système  
**Je veux** proposer automatiquement des combinaisons de tables  
**Afin de** maximiser l'occupation pour les grands groupes  

**Critères d'acceptation :**
- [ ] Si demande pour 10 personnes sans table unique, le système propose :
  - [ ] Combinaison de 2 tables (6+4, 5+5)
  - [ ] Tables adjacentes privilégiées
  - [ ] Même zone privilégiée
- [ ] L'algorithme respecte les contraintes physiques (proximité)
- [ ] Le commerçant peut activer/désactiver cette fonctionnalité

**Valeur métier :** BASSE - Optimisation avancée  
**Estimation :** 13 points (algorithme complexe)  
**Dépendances :** US-R008, US-R005

---

### US-R013 : Préférences clients récurrents
**En tant que** client régulier  
**Je veux** que le système mémorise mes préférences  
**Afin de** avoir une expérience personnalisée  

**Critères d'acceptation :**
- [ ] Le système détecte que je suis un client récurrent (3+ réservations)
- [ ] Il propose automatiquement ma zone/table préférée
- [ ] Il suggère mes créneaux habituels
- [ ] Le commerçant peut voir l'historique client pour personnaliser l'accueil

**Valeur métier :** BASSE - Fidélisation  
**Estimation :** 8 points  
**Dépendances :** US-R005, Booking Service, User Profile Service

---

### US-R014 : Liste d'attente automatique
**En tant que** client  
**Je veux** m'inscrire sur liste d'attente si le restaurant est complet  
**Afin de** être notifié en cas d'annulation  

**Critères d'acceptation :**
- [ ] Je peux rejoindre la liste d'attente pour une date/heure
- [ ] Je reçois une notification si une place se libère (annulation)
- [ ] J'ai 15 minutes pour confirmer mon intérêt
- [ ] Le système propose aux personnes en attente dans l'ordre chronologique

**Valeur métier :** BASSE - Fonctionnalité avancée  
**Estimation :** 13 points  
**Dépendances :** US-R005, Notification Service, Queue System

---

### US-R015 : Gestion des menus par période
**En tant que** commerçant restaurateur  
**Je veux** associer des menus différents aux périodes de service  
**Afin de** informer les clients sur ce qui est disponible  

**Critères d'acceptation :**
- [ ] Je peux lier un menu au petit-déjeuner, un autre au déjeuner
- [ ] Les clients voient le menu disponible lors de la recherche
- [ ] Je peux indiquer des plats du jour
- [ ] Je peux marquer des plats comme "épuisés" en temps réel

**Valeur métier :** BASSE - Feature marketing  
**Estimation :** 8 points  
**Dépendances :** US-R004, Menu Service (à créer)

---

## 📊 Récapitulatif

### Par Priorité
- **🔴 HAUTE (MVP)** : 6 stories (58 points) - 2-3 sprints
- **🟡 MOYENNE** : 4 stories (47 points) - 2 sprints
- **🟢 BASSE** : 5 stories (47 points) - 2-3 sprints

### Par Persona
- **Client** : 5 stories
- **Commerçant Restaurateur** : 8 stories
- **Booking Service (API)** : 2 stories
- **Système** : 1 story

### Effort Total Estimé
**152 points** ≈ **6-8 sprints** (2 semaines/sprint)

---

## 🔗 Dépendances externes

- ✅ **Auth Service** : Authentification commerçants (commercantId)
- ⚠️ **Booking Service** : Intégration réservations (en cours)
- ⚠️ **Notification Service** : Alertes commerçants/clients
- ⚠️ **Redis** : Cache disponibilités
- ❌ **Menu Service** : Association menus (futur)
- ❌ **Analytics Service** : Statistiques avancées (futur)

---

## 🎯 Roadmap suggérée

### Sprint 1-2 : Fondations (MVP Core)
- US-R001, US-R002, US-R003, US-R004

### Sprint 3-4 : Disponibilités (MVP Client)
- US-R005, US-R006

### Sprint 5 : Événements africains
- US-R007

### Sprint 6-7 : Optimisation & UX
- US-R008, US-R009, US-R010

### Sprint 8+ : Features avancées
- US-R011 à US-R015

---

**Dernière mise à jour** : 10 février 2026  
**Responsable Product** : Tech Lead Backend  
**Équipe** : 4 développeurs
