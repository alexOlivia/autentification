
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
