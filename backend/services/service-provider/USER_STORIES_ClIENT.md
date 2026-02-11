1. **Client** - Utilisateur cherchant un service



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