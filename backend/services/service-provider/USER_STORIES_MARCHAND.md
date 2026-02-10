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
