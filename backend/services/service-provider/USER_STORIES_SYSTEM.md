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