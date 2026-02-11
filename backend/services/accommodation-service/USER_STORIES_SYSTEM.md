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
