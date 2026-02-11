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