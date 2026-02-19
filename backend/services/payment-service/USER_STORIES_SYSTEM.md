 ### US-PAY001 : Initialisation d'un paiement
**En tant que** Booking Service  
**Je veux** initialiser un paiement pour une réservation  
**Afin de** permettre au client de payer en ligne de manière sécurisée  

**Critères d'acceptation :**
- [ ] Endpoint `POST /api/payments` disponible
- [ ] Paramètres requis : reservationId, clientId, commercantId, montant, devise, typePaiement
- [ ] Types de paiement supportés : ACOMPTE, PAIEMENT_COMPLET, SOLDE, SUPPLEMENT
- [ ] Création d'un PaymentIntent Stripe avec le montant
- [ ] Le système génère un ID de paiement unique
- [ ] Statut initial : EN_ATTENTE
- [ ] Retourne : `{ paymentId, clientSecret, montant, statut }`
- [ ] Logs détaillés de chaque tentative
- [ ] Timeout configuré (30 secondes maximum)

**Valeur métier :** CRITIQUE - Point d'entrée du paiement  
**Estimation :** 8 points  
**Dépendances :** Stripe API, Booking Service


### US-PAY004 : Confirmation de paiement (Webhook)
**En tant que** système  
**Je veux** recevoir et traiter les webhooks des fournisseurs de paiement  
**Afin de** synchroniser automatiquement les statuts de paiement  

**Critères d'acceptation :**
- [ ] Endpoint `POST /api/payments/webhooks/stripe` pour Stripe
- [ ] Endpoint `POST /api/payments/webhooks/mobile-money` pour Mobile Money
- [ ] Validation de la signature du webhook (sécurité)
- [ ] Traitement des événements : payment_intent.succeeded, payment_intent.failed, charge.refunded
- [ ] Mise à jour du statut du paiement en base de données
- [ ] Idempotence : ne pas retraiter un webhook déjà traité
- [ ] Notification du Booking Service du changement de statut
- [ ] Logs complets de chaque webhook reçu
- [ ] Gestion des webhooks en double (retry de l'opérateur)
- [ ] File d'attente pour traitement asynchrone

**Valeur métier :** CRITIQUE - Fiabilité du système  
**Estimation :** 13 points  
**Dépendances :** Stripe Webhooks, Notification Service, Queue System

---

### US-PAY005 : Vérification de statut de paiement
**En tant que** Booking Service  
**Je veux** vérifier le statut d'un paiement  
**Afin de** confirmer ou annuler une réservation  

**Critères d'acceptation :**
- [ ] Endpoint `GET /api/payments/{paymentId}/status` disponible
- [ ] Retourne : `{ paymentId, statut, montant, methodePaiement, dateConfirmation }`
- [ ] Statuts possibles : EN_ATTENTE, EN_COURS, REUSSI, ECHOUE, ANNULE, REMBOURSE
- [ ] Si statut EN_ATTENTE > 5 minutes, interroger le provider (Stripe/Mobile Money)
- [ ] Cache Redis pour réduire les appels répétitifs (TTL 30s)
- [ ] Permet de récupérer l'historique complet des tentatives
- [ ] Temps de réponse < 500ms

**Valeur métier :** HAUTE - Coordination entre services  
**Estimation :** 5 points  
**Dépendances :** US-PAY001, Redis




### US-PAY009 : Calcul et gestion des commissions plateforme
**En tant que** système  
**Je veux** calculer automatiquement les commissions de la plateforme  
**Afin de** gérer les revenus entre clients, commerçants et plateforme  

**Critères d'acceptation :**
- [ ] Commission configurée par type de service (ex: 10% hébergement, 8% restaurant, 12% services)
- [ ] Calcul automatique lors du paiement : Commission = Montant × Taux
- [ ] Répartition enregistrée : Montant brut, Frais transaction, Commission plateforme, Montant net commerçant
- [ ] Les frais Stripe/Mobile Money sont déduits avant le calcul de commission
- [ ] Exemple : 100€ - 2€ (frais) = 98€, Commission 10% = 9.80€, Commerçant reçoit 88.20€
- [ ] Enregistrement de chaque ligne de transaction
- [ ] Dashboard admin affichant les commissions par période
- [ ] Export CSV des commissions pour comptabilité

**Valeur métier :** MOYENNE - Modèle économique de la plateforme  
**Estimation :** 8 points  
**Dépendances :** US-PAY001, Analytics

