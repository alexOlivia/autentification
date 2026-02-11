# User Stories - Accommodation Service

## 📋 Vue d'ensemble

Ce document contient toutes les user stories du **Accommodation Service** (Service d'hébergement) organisées par persona et priorité.

---

## 🎯 Personas

### 1. **Client** - Voyageur cherchant un hébergement
### 2. **Commerçant Hôtelier** - Propriétaire/gérant d'établissement
### 3. **Admin Plateforme** - Administrateur système
### 4. **Booking Service** - Service interne (API-to-API)

---

## 🔴 Priorité HAUTE - MVP

### US-A001 : Création d'établissement d'hébergement
**En tant que** commerçant hôtelier  
**Je veux** créer le profil de mon établissement sur la plateforme  
**Afin de** proposer mes chambres aux voyageurs  

**Critères d'acceptation :**
- [ ] Je renseigne les informations de base (nom, adresse, téléphone, email)
- [ ] Je choisis le type d'établissement (Hôtel, Auberge, Guesthouse, Resort, Camping)
- [ ] Je définis le nombre total de chambres et d'étages
- [ ] Je configure les horaires de check-in/check-out (ex: 14h-12h)
- [ ] J'indique le classement étoiles (1-5) si applicable
- [ ] Je précise si j'accepte les animaux
- [ ] J'indique si j'accepte le paiement Mobile Money (important en Afrique)
- [ ] Je peux ajouter un logo et une description
- [ ] Le système génère un ID unique

**Valeur métier :** CRITIQUE - Point d'entrée obligatoire  
**Estimation :** 5 points  
**Dépendances :** Auth Service (commercantId)

---

### US-A002 : Gestion des chambres
**En tant que** commerçant hôtelier  
**Je veux** ajouter et configurer les chambres de mon établissement  
**Afin de** gérer précisément mon inventaire disponible  

**Critères d'acceptation :**
- [ ] Je peux ajouter une chambre avec numéro unique (ex: "101", "Suite Royal")
- [ ] Je choisis le type (Simple, Double, Twin, Triple, Suite, Familiale, Dortoir)
- [ ] Je définis le nombre et types de lits (Simple, Double, King, Queen, Superposé)
- [ ] J'indique l'étage et la superficie
- [ ] Je précise le type de vue (Mer, Montagne, Jardin, Ville, Cour, Sans vue)
- [ ] Je liste les équipements (Climatisation, TV, WiFi, Mini-bar, Coffre-fort)
- [ ] Je peux mettre une chambre "hors service" temporairement
- [ ] Je peux modifier/supprimer une chambre (si pas de réservations futures)
- [ ] J'ajoute des photos (minimum 3, maximum 10)

**Valeur métier :** CRITIQUE - Inventaire de base  
**Estimation :** 8 points  
**Dépendances :** US-A001

---

### US-A003 : Configuration des tarifs par chambre
**En tant que** commerçant hôtelier  
**Je veux** définir mes tarifs selon différents critères  
**Afin de** optimiser mes revenus et attirer différents segments  

**Critères d'acceptation :**
- [ ] Je définis un prix de base par nuitée pour chaque type de chambre
- [ ] Je peux créer des tarifs saisonniers (Haute saison, Basse saison, Événements)
- [ ] Je configure des réductions pour longs séjours (7+ nuits : -15%, 30+ nuits : -30%)
- [ ] Je peux appliquer des coefficients pour week-ends/jours fériés
- [ ] Je choisis la devise (XOF, XAF, USD, EUR)
- [ ] J'indique si le petit-déjeuner est inclus ou optionnel (avec prix)
- [ ] Le système affiche automatiquement le prix à payer selon les dates
- [ ] Je peux définir un tarif différent pour résidents vs touristes (contexte africain)

**Valeur métier :** CRITIQUE - Modèle économique  
**Estimation :** 13 points  
**Dépendances :** US-A002

---







### US-A004 : Recherche d'hébergement disponible (Client)
**En tant que** voyageur  
**Je veux** chercher un hébergement disponible pour mes dates de voyage  
**Afin de** planifier mon séjour  

**Critères d'acceptation :**
- [ ] Je saisis la ville/destination
- [ ] Je choisis les dates d'arrivée et de départ
- [ ] J'indique le nombre de voyageurs (adultes + enfants)
- [ ] Le système affiche les établissements disponibles avec :
  - [ ] Prix total du séjour
  - [ ] Type de chambres disponibles
  - [ ] Équipements principaux
  - [ ] Note moyenne et avis
  - [ ] Photos
- [ ] Je peux filtrer par : prix, type d'établissement, équipements, classement
- [ ] Je peux trier par : prix, note, distance
- [ ] Les résultats s'affichent en moins de 3 secondes

**Valeur métier :** CRITIQUE - Fonctionnalité cœur client  
**Estimation :** 13 points  
**Dépendances :** US-A002, US-A003, Booking Service

---

### US-A005 : Vérification de disponibilité (API interne)
**En tant que** Booking Service  
**Je veux** vérifier la disponibilité d'une chambre avant de créer une réservation  
**Afin de** éviter les surréservations  

**Critères d'acceptation :**
- [ ] Endpoint `/api/accommodations/{id}/availability` disponible
- [ ] Paramètres : hebergementId, dateArrivee, dateDepart, nombrePersonnes, typeChambre
- [ ] Le système vérifie les chevauchements avec réservations existantes
- [ ] La réponse indique : `{ available: boolean, chambreIds: [], prix: number, suggestions: [] }`
- [ ] Le système gère les réservations simultanées avec transactions/locks
- [ ] Cache Redis pour accélérer les vérifications fréquentes
- [ ] Prise en compte des chambres en maintenance

**Valeur métier :** CRITIQUE - Intégrité des données  
**Estimation :** 8 points  
**Dépendances :** US-A004, Redis, Booking Service

---

### US-A006 : Gestion du petit-déjeuner
**En tant que** commerçant hôtelier  
**Je veux** configurer mon service de petit-déjeuner  
**Afin de** proposer cette prestation aux clients  

**Critères d'acceptation :**
- [ ] J'indique si le petit-déjeuner est : Inclus, Optionnel, Non disponible
- [ ] Si optionnel, je définis le prix par personne
- [ ] Je configure les horaires de service (ex: 6h30-10h)
- [ ] J'indique le type : Continental, Buffet, À la carte, Africain traditionnel
- [ ] Je peux lister les plats disponibles
- [ ] Le système calcule automatiquement le supplément lors de la réservation

**Valeur métier :** HAUTE - Service important  
**Estimation :** 5 points  
**Dépendances :** US-A001

---

## 🟡 Priorité MOYENNE

### US-A007 : Gestion des espaces événementiels (Salles, Jardins, Piscines)
**En tant que** commerçant hôtelier  
**Je veux** proposer mes espaces pour des événements  
**Afin de** diversifier mes revenus (mariages, baptêmes, séminaires)  

**Critères d'acceptation :**
- [ ] Je peux créer une salle de réception avec capacité et équipements
- [ ] Je peux créer un jardin/espace extérieur avec superficie
- [ ] Je peux créer une piscine avec dimensions et capacité
- [ ] Je définis les tarifs (par heure, demi-journée, journée, soirée)
- [ ] J'indique les dispositions possibles (Théâtre, Classe, Cocktail, Banquet)
- [ ] Je peux mettre l'espace hors service temporairement
- [ ] Le système gère les disponibilités séparément des chambres
- [ ] Je reçois une notification pour validation manuelle des demandes

**Valeur métier :** HAUTE - Contexte africain (événements familiaux)  
**Estimation :** 13 points  
**Dépendances :** US-A001, Notification Service

---

### US-A008 : Recherche d'espaces événementiels
**En tant que** client organisant un événement  
**Je veux** trouver un lieu adapté pour mon mariage/baptême/séminaire  
**Afin de** réserver le lieu idéal  

**Critères d'acceptation :**
- [ ] Je cherche par : date, capacité, type d'espace (Salle/Jardin/Piscine)
- [ ] Le système affiche les établissements avec espaces disponibles
- [ ] Je vois les photos, capacités, équipements, et tarifs
- [ ] Je peux filtrer par équipements (Sono, Projecteur, Traiteur accepté)
- [ ] Je peux demander plusieurs espaces simultanément (ex: Jardin + Salle)
- [ ] Le système propose des packages (Espace + Chambres pour invités)

**Valeur métier :** HAUTE - Feature différenciante  
**Estimation :** 13 points  
**Dépendances :** US-A007, US-A004

---

### US-A009 : Tarifs résidents vs touristes
**En tant que** commerçant hôtelier  
**Je veux** appliquer des tarifs différenciés  
**Afin de** adapter mes prix au marché local et international  

**Critères d'acceptation :**
- [ ] Je peux définir un tarif "Résidents" et un tarif "Touristes"
- [ ] Le système détecte automatiquement selon :
  - [ ] Pays du numéro de téléphone
  - [ ] Adresse de facturation
  - [ ] Sélection manuelle du client
- [ ] L'écart tarifaire est configurable (ex: -30% pour résidents)
- [ ] Cette politique est affichée clairement au client
- [ ] Je peux activer/désactiver cette différenciation

**Valeur métier :** MOYENNE - Pratique courante en Afrique  
**Estimation :** 8 points  
**Dépendances :** US-A003, User Profile Service

---

### US-A010 : Dashboard occupation et revenus
**En tant que** commerçant hôtelier  
**Je veux** voir des statistiques sur mon établissement  
**Afin de** optimiser ma gestion  

**Critères d'acceptation :**
- [ ] Dashboard avec taux d'occupation global et par type de chambre
- [ ] Graphiques sur 7 jours, 30 jours, année
- [ ] Revenus par jour/mois avec projection
- [ ] Chambres les plus/moins réservées
- [ ] Durée moyenne de séjour
- [ ] Taux d'annulation
- [ ] Revenus annexes (Petit-déjeuner, Espaces événementiels)
- [ ] Export CSV/Excel pour comptabilité

**Valeur métier :** MOYENNE - Aide à la décision  
**Estimation :** 13 points  
**Dépendances :** US-A001-A006, Analytics Service

---

### US-A011 : Galerie photos et visite virtuelle
**En tant que** commerçant hôtelier  
**Je veux** présenter mes chambres et espaces visuellement  
**Afin de** rassurer et attirer les clients  

**Critères d'acceptation :**
- [ ] Je peux uploader jusqu'à 50 photos par chambre
- [ ] Les photos sont compressées automatiquement (optimisation mobile)
- [ ] Je peux définir une photo de couverture par chambre
- [ ] Je peux organiser les photos par glisser-déposer
- [ ] Je peux ajouter des légendes aux photos
- [ ] Option visite virtuelle 360° (intégration future)
- [ ] Les clients voient un carrousel fluide sur mobile

**Valeur métier :** MOYENNE - Améliore conversion  
**Estimation :** 8 points  
**Dépendances :** US-A002, Cloud Storage Service

---

## 🟢 Priorité BASSE - Améliorations futures

### US-A012 : Gestion du ménage et maintenance
**En tant que** commerçant hôtelier  
**Je veux** gérer les états de mes chambres  
**Afin de** coordonner mon équipe de ménage  

**Critères d'acceptation :**
- [ ] Je peux marquer une chambre : Propre, À nettoyer, En cours de nettoyage, Maintenance
- [ ] Je vois un tableau de bord temps réel de l'état des chambres
- [ ] Je peux assigner des tâches aux femmes de chambre
- [ ] Notifications automatiques au départ client (chambre à nettoyer)
- [ ] Historique des maintenances par chambre

**Valeur métier :** BASSE - Gestion opérationnelle  
**Estimation :** 13 points  
**Dépendances :** US-A002, Staff Management Module

---

### US-A013 : Programme de fidélité
**En tant que** client régulier  
**Je veux** bénéficier d'avantages fidélité  
**Afin de** être récompensé de ma fidélité  

**Critères d'acceptation :**
- [ ] Chaque nuitée génère des points (1 nuitée = 10 points)
- [ ] Je vois mon solde de points dans mon profil
- [ ] Je peux échanger 100 points contre une nuitée gratuite (ou réduction)
- [ ] Je reçois des offres exclusives (early check-in, late check-out)
- [ ] Le commerçant configure son propre système de récompenses

**Valeur métier :** BASSE - Fidélisation  
**Estimation :** 13 points  
**Dépendances :** US-A004, Loyalty Service, User Profile

---

### US-A014 : Connexion avec services de transport
**En tant que** client  
**Je veux** réserver un transfert aéroport en même temps que ma chambre  
**Afin de** simplifier mon arrivée  

**Critères d'acceptation :**
- [ ] Lors de la réservation, option "Ajouter un transfert"
- [ ] Je choisis aéroport/gare de départ et heure d'arrivée
- [ ] Le système propose des véhicules disponibles du Transport Service
- [ ] Le prix du transfert est ajouté au montant total
- [ ] Le chauffeur reçoit les détails de ma réservation hôtel
- [ ] Intégration bidirectionnelle avec Transport Service

**Valeur métier :** BASSE - Valeur ajoutée  
**Estimation :** 13 points  
**Dépendances :** Transport Service, Booking Service

---

### US-A015 : Tarification dynamique (Yield Management)
**En tant que** système  
**Je veux** ajuster automatiquement les tarifs selon la demande  
**Afin de** maximiser les revenus du commerçant  

**Critères d'acceptation :**
- [ ] Algorithme analyse : taux d'occupation, date de réservation, événements locaux
- [ ] Les prix augmentent automatiquement si forte demande (jusqu'à +50%)
- [ ] Les prix baissent si faible occupation proche de la date (-30%)
- [ ] Le commerçant peut activer/désactiver cette fonctionnalité
- [ ] Le commerçant définit les limites min/max de variation
- [ ] Dashboard pour suivre l'impact des ajustements

**Valeur métier :** BASSE - Optimisation avancée  
**Estimation :** 21 points (algorithme complexe)  
**Dépendances :** US-A003, Machine Learning Module

---

### US-A016 : Avis et notes clients
**En tant que** voyageur  
**Je veux** lire et laisser des avis sur les établissements  
**Afin de** faire un choix éclairé et partager mon expérience  

**Critères d'acceptation :**
- [ ] Je peux noter un établissement (1-5 étoiles) après mon séjour
- [ ] Je peux noter séparément : Propreté, Accueil, Rapport qualité/prix, Emplacement
- [ ] Je peux laisser un commentaire texte (500 caractères max)
- [ ] Je peux ajouter des photos (5 max)
- [ ] Le commerçant peut répondre aux avis
- [ ] Les avis sont modérés (détection spam/insultes)
- [ ] Note globale calculée automatiquement

**Valeur métier :** BASSE - Confiance et social proof  
**Estimation :** 13 points  
**Dépendances :** Booking Service, Review/Rating Service

---

## 📊 Récapitulatif

### Par Priorité
- **🔴 HAUTE (MVP)** : 6 stories (52 points) - 2-3 sprints
- **🟡 MOYENNE** : 5 stories (55 points) - 2-3 sprints
- **🟢 BASSE** : 5 stories (73 points) - 3-4 sprints

### Par Persona
- **Client/Voyageur** : 6 stories
- **Commerçant Hôtelier** : 8 stories
- **Booking Service (API)** : 2 stories
- **Système** : 1 story

### Effort Total Estimé
**180 points** ≈ **7-10 sprints** (2 semaines/sprint)

---

## 🔗 Dépendances externes

- ✅ **Auth Service** : Authentification commerçants
- ⚠️ **Booking Service** : Intégration réservations
- ⚠️ **Notification Service** : Alertes
- ⚠️ **Redis** : Cache disponibilités
- ❌ **Transport Service** : Transferts aéroport
- ❌ **Payment Service** : Mobile Money
- ❌ **Review Service** : Avis clients
- ❌ **Analytics Service** : Statistiques avancées

---

## 🎯 Roadmap suggérée

### Sprint 1-2 : Fondations (MVP Core)
- US-A001, US-A002, US-A003, US-A006

### Sprint 3-4 : Disponibilités (MVP Client)
- US-A004, US-A005

### Sprint 5-6 : Événements & Photos
- US-A007, US-A008, US-A011

### Sprint 7-8 : Optimisation & Analytics
- US-A009, US-A010

### Sprint 9+ : Features avancées
- US-A012 à US-A016

---

**Dernière mise à jour** : 10 février 2026  
**Responsable Product** : Tech Lead Backend  
**Équipe** : 4 développeurs
