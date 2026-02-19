# User Stories - Service Provider

## 📋 Vue d'ensemble

Ce document contient toutes les user stories du **Service Provider** (Fournisseurs de services) organisées par persona et priorité.

---

## 🎯 Personas

### 1. **Client** - Utilisateur cherchant un service
### 2. **Commerçant Prestataire** - Propriétaire de salon/centre de services
### 3. **Professionnel** - Coiffeur, esthéticien, photographe, etc.
### 4. **Admin Plateforme** - Administrateur système
### 5. **Booking Service** - Service interne (API-to-API)

---

## 🔴 Priorité HAUTE - MVP

### US-P001 : Création d'établissement de services
**En tant que** commerçant prestataire  
**Je veux** créer le profil de mon établissement sur la plateforme  
**Afin de** proposer mes services aux clients  

**Critères d'acceptation :**
- [ ] Je renseigne les informations de base (nom, adresse, téléphone)
- [ ] Je choisis le type de service principal (Coiffure, Barbier, Esthétique, Spa, Massage, Photographie, etc.)
- [ ] J'indique la capacité simultanée (nombre de clients en même temps)
- [ ] Je configure si j'accepte les rendez-vous en ligne
- [ ] Je définis le délai minimum d'annulation (ex: 24h)
- [ ] Je peux accepter les services à domicile (contexte africain)
- [ ] Je télécharge des photos de mon établissement
- [ ] Le système génère un ID unique

**Valeur métier :** CRITIQUE - Point d'entrée obligatoire  
**Estimation :** 5 points  
**Dépendances :** Auth Service (commercantId)

---

### US-P002 : Gestion de l'équipe de professionnels
**En tant que** commerçant prestataire  
**Je veux** ajouter et gérer mes employés/collaborateurs  
**Afin de** organiser les rendez-vous par personne  

**Critères d'acceptation :**
- [ ] Je peux ajouter un professionnel (prénom, nom, spécialité)
- [ ] J'indique ses années d'expérience et certifications
- [ ] J'ajoute une photo et une description personnelle
- [ ] Je définis ses horaires de travail (Lundi-Dimanche, heures)
- [ ] Je peux le mettre en congé/indisponible temporairement
- [ ] Chaque professionnel a son propre calendrier de rendez-vous
- [ ] Les clients peuvent voir les profils et choisir leur professionnel préféré
- [ ] Je peux modifier/désactiver un professionnel

**Valeur métier :** CRITIQUE - Gestion des ressources humaines  
**Estimation :** 8 points  
**Dépendances :** US-P001

---

### US-P003 : Catalogue de services
**En tant que** commerçant prestataire  
**Je veux** créer mon catalogue de services avec tarifs  
**Afin de** que les clients connaissent mes prestations  

**Critères d'acceptation :**
- [ ] Je peux créer un service avec nom et description
- [ ] Je choisis la catégorie (Coupe homme, Coupe femme, Tresses sénégalaises, Manucure, Massage relaxant, etc.)
- [ ] Je définis la durée en minutes (ex: 30, 45, 60, 90, 120)
- [ ] J'indique le prix de base
- [ ] Je peux ajouter des photos avant/après
- [ ] Je peux associer le service à un ou plusieurs professionnels spécifiques
- [ ] Je peux activer/désactiver un service
- [ ] Services spécifiques au contexte africain : Tressage, Nattes africaines, Tissage, Défrisage

**Valeur métier :** CRITIQUE - Offre commerciale  
**Estimation :** 8 points  
**Dépendances :** US-P001, US-P002

---

### US-P004 : Gestion des créneaux de disponibilité
**En tant que** commerçant prestataire  
**Je veux** définir les créneaux disponibles pour chaque professionnel  
**Afin de** permettre la prise de rendez-vous en ligne  

**Critères d'acceptation :**
- [ ] Je configure les horaires d'ouverture généraux (ex: 8h-20h)
- [ ] Je définis les plages horaires par intervalle (15, 30, 60 minutes)
- [ ] Je peux bloquer des créneaux spécifiques (pause, formation, événement)
- [ ] Le système génère automatiquement les créneaux disponibles
- [ ] Je peux créer des créneaux récurrents (ex: tous les lundis 9h-12h)
- [ ] Chaque professionnel a son propre planning
- [ ] Je vois visuellement l'occupation de la semaine

**Valeur métier :** CRITIQUE - Gestion du temps  
**Estimation :** 13 points  
**Dépendances :** US-P002, US-P003

---









### US-P005 : Recherche de service et prise de rendez-vous (Client)
**En tant que** client  
**Je veux** trouver et réserver un service qui me convient  
**Afin de** planifier ma visite  

**Critères d'acceptation :**
- [ ] Je cherche par type de service (Coiffure, Massage, Photographie, etc.)
- [ ] Je filtre par localisation (ville, quartier, distance)
- [ ] Je choisis la date souhaitée
- [ ] Le système affiche les établissements disponibles avec :
  - [ ] Services proposés et prix
  - [ ] Professionnels disponibles avec photos
  - [ ] Créneaux horaires disponibles
  - [ ] Note moyenne et avis
- [ ] Je peux filtrer par : prix, note, proximité, professionnel femme/homme
- [ ] Je sélectionne un créneau et confirme
- [ ] Je reçois une confirmation par SMS/email
- [ ] Temps de recherche < 3 secondes

**Valeur métier :** CRITIQUE - Fonctionnalité cœur client  
**Estimation :** 13 points  
**Dépendances :** US-P003, US-P004, Booking Service

---

### US-P006 : Vérification de disponibilité (API interne)
**En tant que** Booking Service  
**Je veux** vérifier la disponibilité d'un créneau avant de créer un rendez-vous  
**Afin de** éviter les doubles réservations  

**Critères d'acceptation :**
- [ ] Endpoint `/api/service-providers/{id}/availability` disponible
- [ ] Paramètres : etablissementId, serviceId, prestataireId, date, heureDebut
- [ ] Le système vérifie les chevauchements avec les rendez-vous existants
- [ ] La réponse indique : `{ available: boolean, creneauId: string, prixTotal: number }`
- [ ] Gestion des réservations simultanées avec locks/transactions
- [ ] Cache Redis pour les établissements à forte affluence
- [ ] Prise en compte du temps de préparation entre deux prestations

**Valeur métier :** CRITIQUE - Intégrité des données  
**Estimation :** 8 points  
**Dépendances :** US-P005, Redis, Booking Service

---









## 🟡 Priorité MOYENNE

### US-P007 : Services à domicile
**En tant que** commerçant prestataire  
**Je veux** proposer des services à domicile  
**Afin de** atteindre plus de clients (contexte africain : mariages, cérémonies)  

**Critères d'acceptation :**
- [ ] Je peux marquer un service comme "Disponible à domicile"
- [ ] Je définis un supplément de déplacement (fixe ou par km)
- [ ] Je précise le rayon d'intervention (ex: 10 km autour de mon établissement)
- [ ] Le client saisit son adresse lors de la réservation
- [ ] Le système calcule la distance et ajoute les frais de déplacement
- [ ] Je peux voir l'adresse du client sur une carte
- [ ] Option pour bloquer des créneaux pour grands événements (mariage entier)

**Valeur métier :** HAUTE - Différenciation forte en Afrique  
**Estimation :** 13 points  
**Dépendances :** US-P003, Maps Service, Pricing Engine

---

### US-P008 : Gestion des promotions
**En tant que** commerçant prestataire  
**Je veux** créer des offres promotionnelles  
**Afin de** attirer de nouveaux clients et fidéliser  

**Critères d'acceptation :**
- [ ] Je peux créer une promotion avec un nom accrocheur
- [ ] Je choisis le type de réduction (Pourcentage, Montant fixe)
- [ ] J'indique la valeur (ex: -30%, -5000 FCFA)
- [ ] Je sélectionne les services concernés (ou tous)
- [ ] Je définis la période de validité (date début/fin)
- [ ] Je peux limiter aux nouveaux clients uniquement
- [ ] La réduction s'applique automatiquement lors de la réservation
- [ ] Je vois l'impact sur les réservations dans le dashboard

**Valeur métier :** HAUTE - Acquisition client  
**Estimation :** 8 points  
**Dépendances :** US-P003, US-P005

---

### US-P009 : Forfaits et packages
**En tant que** commerçant prestataire  
**Je veux** créer des forfaits combinant plusieurs services  
**Afin de** augmenter mon panier moyen  

**Critères d'acceptation :**
- [ ] Je peux créer un forfait (ex: "Beauté Complète", "Mariée Africaine")
- [ ] Je sélectionne les services inclus
- [ ] Le forfait a un prix global inférieur à la somme des services
- [ ] Je définis la durée totale estimée
- [ ] Les clients voient les forfaits comme option lors de la recherche
- [ ] La réservation d'un forfait bloque le temps nécessaire pour tous les services
- [ ] Exemples contexte africain : Forfait Mariage (Maquillage + Coiffure + Onglerie + Essayages)

**Valeur métier :** MOYENNE - Augmente revenus  
**Estimation :** 13 points  
**Dépendances :** US-P003, US-P004

---

### US-P010 : Profil professionnel et portfolio
**En tant que** professionnel (coiffeur, photographe, etc.)  
**Je veux** avoir mon propre profil avec galerie de mes réalisations  
**Afin de** attirer des clients grâce à mon travail  

**Critères d'acceptation :**
- [ ] J'ai une page profil personnelle avec ma photo et bio
- [ ] Je peux uploader mes réalisations (photos avant/après)
- [ ] Je peux ajouter des vidéos de mes techniques (pour réseaux sociaux)
- [ ] Les clients peuvent laisser des avis sur moi spécifiquement
- [ ] Ma note personnelle est affichée séparément de l'établissement
- [ ] Je peux partager mon profil sur WhatsApp/Facebook/Instagram
- [ ] Les clients peuvent me suivre pour être notifiés de mes disponibilités

**Valeur métier :** MOYENNE - Différenciation personnelle  
**Estimation :** 13 points  
**Dépendances :** US-P002, Cloud Storage, Social Media Integration

---

### US-P011 : Dashboard et statistiques
**En tant que** commerçant prestataire  
**Je veux** voir des statistiques sur mon activité  
**Afin de** optimiser ma gestion  

**Critères d'acceptation :**
- [ ] Dashboard avec nombre de rendez-vous par jour/semaine/mois
- [ ] Revenus générés avec projection mensuelle
- [ ] Services les plus demandés
- [ ] Professionnels les plus réservés
- [ ] Heures de pointe identifiées
- [ ] Taux d'occupation moyen par professionnel
- [ ] Taux d'annulation et no-shows
- [ ] Export CSV pour comptabilité

**Valeur métier :** MOYENNE - Aide à la décision  
**Estimation :** 13 points  
**Dépendances :** US-P001-P006, Analytics Service

---

## 🟢 Priorité BASSE - Améliorations futures

### US-P012 : Programme de fidélité
**En tant que** client régulier  
**Je veux** être récompensé de ma fidélité  
**Afin de** bénéficier d'avantages  

**Critères d'acceptation :**
- [ ] Chaque prestation génère des points (1000 FCFA = 1 point)
- [ ] Je vois mon solde de points dans mon profil
- [ ] Je peux échanger 100 points contre une réduction de 5000 FCFA
- [ ] Après 5 visites, je reçois une prestation gratuite (définie par le commerçant)
- [ ] Je reçois des offres exclusives pour mon anniversaire
- [ ] Le commerçant configure son propre système de récompenses

**Valeur métier :** BASSE - Fidélisation  
**Estimation :** 13 points  
**Dépendances :** US-P005, Loyalty Service

---

### US-P013 : Rappels automatiques
**En tant que** système  
**Je veux** envoyer des rappels aux clients  
**Afin de** réduire les no-shows  

**Critères d'acceptation :**
- [ ] SMS automatique envoyé 24h avant le rendez-vous
- [ ] SMS de rappel 2h avant (optionnel, configurable)
- [ ] Le client peut confirmer/annuler directement depuis le SMS
- [ ] Notification push si l'app mobile est installée
- [ ] Le commerçant peut personnaliser les messages
- [ ] Statistiques sur l'impact des rappels (réduction des no-shows)

**Valeur métier :** BASSE - Optimisation opérationnelle  
**Estimation :** 8 points  
**Dépendances :** Notification Service, SMS Gateway

---

### US-P014 : Gestion des stocks de produits
**En tant que** commerçant prestataire (salon de coiffure)  
**Je veux** gérer mes stocks de produits utilisés  
**Afin de** ne jamais être en rupture  

**Critères d'acceptation :**
- [ ] Je peux créer une liste de produits (Shampoing, Teinture, Vernis, etc.)
- [ ] J'indique la quantité en stock
- [ ] Je définis un seuil d'alerte (ex: alerte si < 3 unités)
- [ ] Le système me notifie quand un produit est bas
- [ ] Je peux lier des produits à des services (ex: Coloration utilise Teinture)
- [ ] Historique des consommations

**Valeur métier :** BASSE - Gestion avancée  
**Estimation :** 13 points  
**Dépendances :** US-P003, Inventory Management Module

---

### US-P015 : Liste d'attente et notifications de désistement
**En tant que** client  
**Je veux** être notifié si un créneau se libère  
**Afin de** obtenir un rendez-vous plus tôt  

**Critères d'acceptation :**
- [ ] Si aucun créneau disponible, je peux rejoindre une liste d'attente
- [ ] En cas d'annulation, je reçois une notification (push + SMS)
- [ ] J'ai 30 minutes pour confirmer mon intérêt
- [ ] Le système propose aux personnes en attente dans l'ordre chronologique
- [ ] Je peux voir ma position dans la file d'attente

**Valeur métier :** BASSE - Optimisation remplissage  
**Estimation :** 13 points  
**Dépendances :** US-P006, Notification Service, Queue System

---

### US-P016 : Avis et notes détaillés
**En tant que** client  
**Je veux** laisser un avis après ma prestation  
**Afin de** aider d'autres clients et féliciter le professionnel  

**Critères d'acceptation :**
- [ ] Je peux noter l'établissement (1-5 étoiles)
- [ ] Je peux noter le professionnel séparément
- [ ] Je note plusieurs critères : Qualité, Accueil, Ambiance, Propreté, Rapport qualité/prix
- [ ] Je peux laisser un commentaire texte
- [ ] Je peux ajouter des photos du résultat (si j'accepte)
- [ ] Le professionnel peut répondre à mon avis
- [ ] Les avis sont vérifiés (uniquement clients ayant vraiment réservé)

**Valeur métier :** BASSE - Social proof  
**Estimation :** 13 points  
**Dépendances :** Booking Service, Review/Rating Service

---

## 📊 Récapitulatif

### Par Priorité
- **🔴 HAUTE (MVP)** : 6 stories (55 points) - 2-3 sprints
- **🟡 MOYENNE** : 5 stories (60 points) - 3 sprints
- **🟢 BASSE** : 5 stories (60 points) - 3 sprints

### Par Persona
- **Client** : 4 stories (US-P005, US-P012, US-P015, US-P016)
- **Commerçant Prestataire** : 9 stories (US-P001, US-P002, US-P003, US-P004, US-P007, US-P008, US-P009, US-P011, US-P014)
- **Professionnel** : 1 story (US-P010)
- **Booking Service (API)** : 1 story (US-P006)
- **Système** : 1 story (US-P013)

### Effort Total Estimé
**175 points** ≈ **8-10 sprints** (2 semaines/sprint)

---

## 🔗 Dépendances externes

- ✅ **Auth Service** : Authentification commerçants
- ⚠️ **Booking Service** : Intégration rendez-vous
- ⚠️ **Notification Service** : Rappels SMS/Push
- ⚠️ **Redis** : Cache disponibilités
- ❌ **Maps Service** : Calcul distances domicile
- ❌ **Payment Service** : Mobile Money
- ❌ **Review Service** : Avis clients
- ❌ **SMS Gateway** : Envoi SMS rappels
- ❌ **Social Media API** : Partage profils

---

## 🎯 Roadmap suggérée

### Sprint 1-2 : Fondations (MVP Core)
- US-P001, US-P002, US-P003

### Sprint 3-4 : Planning & Réservations (MVP Client)
- US-P004, US-P005, US-P006

### Sprint 5-6 : Services à domicile & Promotions
- US-P007, US-P008

### Sprint 7-8 : Portfolio & Analytics
- US-P009, US-P010, US-P011

### Sprint 9+ : Fidélisation & Features avancées
- US-P012 à US-P016

---

## 💡 Cas d'usage spécifiques contexte africain

### Tressage et coiffure africaine
- Durées longues (3-8h pour tresses sénégalaises)
- Nécessité de bloquer de longs créneaux
- Photos avant/après essentielles (portfolio)
- Services à domicile très demandés pour événements

### Préparation mariages traditionnels
- Forfaits "Mariée complète" (Henné, Maquillage, Coiffure, Bijoux)
- Services sur plusieurs jours
- Équipe mobile se déplaçant au domicile
- Gestion de grands groupes (famille de la mariée)

### Photographie d'événements
- Packages (Baptême, Mariage, Anniversaire)
- Réservation longue durée (journée entière)
- Livrables numériques (galerie en ligne)
- Acompte requis pour bloquer la date

---

**Dernière mise à jour** : 10 février 2026  
**Responsable Product** : Tech Lead Backend  
**Équipe** : 4 développeurs
