# User Stories - Payment Service

## 📋 Vue d'ensemble

Ce document contient toutes les user stories du **Payment Service** (Service de paiement) organisées par persona et priorité.

---

## 🎯 Personas

### 1. **Client** - Utilisateur effectuant une réservation
### 2. **Commerçant** - Prestataire recevant des paiements
### 3. **Admin Plateforme** - Administrateur système
### 4. **Booking Service** - Service interne (API-to-API)
### 5. **Système** - Traitements automatisés

---

## 🔴 Priorité HAUTE - MVP

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

---

### US-PAY002 : Paiement par carte bancaire (Stripe)
**En tant que** client  
**Je veux** payer ma réservation par carte bancaire via Stripe  
**Afin de** sécuriser ma réservation rapidement  

**Critères d'acceptation :**
- [ ] Intégration Stripe Elements pour la saisie sécurisée de carte
- [ ] Support des cartes : Visa, Mastercard, American Express
- [ ] Validation côté client avant soumission (numéro, date, CVV)
- [ ] Authentification 3D Secure automatique si requise
- [ ] Affichage du montant en temps réel avec devise
- [ ] Gestion des erreurs lisibles pour l'utilisateur (carte refusée, fonds insuffisants)
- [ ] Confirmation immédiate après paiement réussi
- [ ] Redirection vers page de confirmation avec numéro de transaction
- [ ] Compatible mobile (responsive)

**Valeur métier :** CRITIQUE - Moyen de paiement principal  
**Estimation :** 13 points  
**Dépendances :** Stripe SDK, US-PAY001

---

### US-PAY003 : Paiement Mobile Money
**En tant que** client africain  
**Je veux** payer avec Mobile Money (Orange Money, MTN Money, Moov Money)  
**Afin de** utiliser ma méthode de paiement préférée  

**Critères d'acceptation :**
- [ ] Sélection de l'opérateur : Orange Money, MTN Money, Moov Money, Wave, Airtel Money
- [ ] Saisie du numéro de téléphone (format international)
- [ ] Vérification du format selon l'opérateur
- [ ] Initiation de la transaction via API de l'opérateur
- [ ] Le client reçoit une notification USSD sur son téléphone
- [ ] Le client saisit son code PIN sur son téléphone
- [ ] Polling du statut toutes les 3 secondes (timeout 3 minutes)
- [ ] Affichage du statut : En attente de validation, Réussi, Échoué
- [ ] Enregistrement du code de transaction opérateur
- [ ] Gestion des annulations/timeouts

**Valeur métier :** CRITIQUE - Contexte africain, paiement majeur  
**Estimation :** 21 points (intégrations multiples)  
**Dépendances :** APIs opérateurs Mobile Money, Agrégateur de paiement

---

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

---

### US-PAY006 : Génération de facture automatique
**En tant que** client  
**Je veux** recevoir une facture après paiement réussi  
**Afin de** avoir une preuve de ma transaction  

**Critères d'acceptation :**
- [ ] Génération automatique après paiement REUSSI
- [ ] Numéro de facture unique au format : FACT-YYYYMMDD-XXXXX
- [ ] Contenu : Nom client, adresse, détails réservation, montant HT/TTC, TVA
- [ ] Génération d'un PDF avec logo de la plateforme
- [ ] Stockage du PDF dans un service cloud (S3/Azure Blob)
- [ ] URL de téléchargement valide 1 an
- [ ] Envoi automatique par email via Notification Service
- [ ] Possibilité de télécharger depuis l'espace client
- [ ] Mention des moyens de paiement utilisés

**Valeur métier :** HAUTE - Obligation légale  
**Estimation :** 8 points  
**Dépendances :** PDF Generator, Cloud Storage, Notification Service

---

## 🟡 Priorité MOYENNE

### US-PAY007 : Gestion des remboursements
**En tant que** commerçant ou admin  
**Je veux** initier un remboursement pour une réservation annulée  
**Afin de** restituer les fonds au client selon la politique d'annulation  

**Critères d'acceptation :**
- [ ] Endpoint `POST /api/payments/{paymentId}/refund` disponible
- [ ] Paramètres : montantRembourse (peut être partiel), raisonRemboursement
- [ ] Application automatique de la politique d'annulation (0%, 50%, 100%)
- [ ] Calcul basé sur le délai d'annulation (ex: >7j = 100%, 3-7j = 50%, <3j = 0%)
- [ ] Création d'un Refund Stripe si paiement par carte
- [ ] Remboursement Mobile Money via API opérateur
- [ ] Statut remboursement : DEMANDE, EN_COURS, EFFECTUE, ECHOUE
- [ ] Délai de traitement : 5-10 jours ouvrés (affichage au client)
- [ ] Notification client de l'initiation et confirmation du remboursement
- [ ] Génération d'un avoir si remboursement partiel

**Valeur métier :** HAUTE - Gestion des annulations  
**Estimation :** 13 points  
**Dépendances :** US-PAY002, US-PAY003, Booking Service, Politique d'annulation

---

### US-PAY008 : Paiement fractionné (Acompte + Solde)
**En tant que** client  
**Je veux** payer en deux fois (acompte maintenant, solde plus tard)  
**Afin de** étaler mes dépenses pour les grandes réservations  

**Critères d'acceptation :**
- [ ] Option "Paiement en 2 fois" lors de la réservation (si montant > seuil, ex: 50 000 FCFA)
- [ ] Acompte minimum : 30% du montant total (configurable par commerçant)
- [ ] Premier paiement immédiat (ACOMPTE)
- [ ] Date limite de paiement du solde : 7 jours avant la date de réservation
- [ ] Email de rappel envoyé 10 jours, 5 jours, 1 jour avant échéance
- [ ] Le client peut payer le solde à tout moment depuis son espace
- [ ] Annulation automatique de la réservation si solde impayé à l'échéance
- [ ] Remboursement partiel de l'acompte selon politique d'annulation
- [ ] Dashboard client affichant : Montant payé, Solde restant, Date limite

**Valeur métier :** MOYENNE - Facilite les grandes dépenses  
**Estimation :** 13 points  
**Dépendances :** US-PAY001, US-PAY002, US-PAY003, Notification Service

---

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

---

### US-PAY010 : Dashboard commerçant - Paiements reçus
**En tant que** commerçant  
**Je veux** voir tous mes paiements reçus et mon solde  
**Afin de** suivre mes revenus  

**Critères d'acceptation :**
- [ ] Page dédiée affichant : Solde disponible, En attente, Total reçu ce mois
- [ ] Liste de tous les paiements avec : Date, Client, Montant brut, Commission, Montant net
- [ ] Filtres : Par date, Par statut, Par moyen de paiement
- [ ] Graphique d'évolution des revenus (7j, 30j, 12 mois)
- [ ] Téléchargement des justificatifs de paiement (factures)
- [ ] Export CSV des paiements pour comptabilité
- [ ] Affichage des prochains virements prévus (calendrier de paiement plateforme)

**Valeur métier :** MOYENNE - Transparence pour commerçants  
**Estimation :** 13 points  
**Dépendances :** US-PAY009, Analytics Service

---

### US-PAY011 : Paiement en espèces (sur place)
**En tant que** client  
**Je veux** réserver en ligne mais payer en espèces sur place  
**Afin de** éviter les frais de transaction en ligne  

**Critères d'acceptation :**
- [ ] Option "Paiement sur place" lors de la réservation
- [ ] Aucun paiement en ligne requis, réservation confirmée directement
- [ ] Statut paiement : EN_ATTENTE_PAIEMENT_SUR_PLACE
- [ ] Le commerçant reçoit la réservation mais sait que le paiement est à recevoir
- [ ] Le commerçant peut marquer le paiement comme "Reçu en espèces" depuis son dashboard
- [ ] Changement de statut : REUSSI après confirmation manuelle
- [ ] Génération de la facture après confirmation manuelle
- [ ] Option désactivable par le commerçant (s'il refuse le paiement sur place)

**Valeur métier :** MOYENNE - Flexibilité, contexte africain  
**Estimation :** 8 points  
**Dépendances :** US-PAY006, Booking Service

---

## 🟢 Priorité BASSE - Améliorations futures

### US-PAY012 : Paiement récurrent (abonnements)
**En tant que** client  
**Je veux** payer un abonnement mensuel pour des services réguliers  
**Afin de** bénéficier de tarifs préférentiels  

**Critères d'acceptation :**
- [ ] Création d'un abonnement avec fréquence (hebdomadaire, mensuel)
- [ ] Prélèvement automatique à date fixe (ex: 1er du mois)
- [ ] Le client peut annuler l'abonnement à tout moment
- [ ] Notification 3 jours avant chaque prélèvement
- [ ] Gestion des échecs de paiement (retry 3 fois, puis suspension)
- [ ] Dashboard client affichant les prochains prélèvements
- [ ] Applicable aux : services coiffure récurrents, location long terme

**Valeur métier :** BASSE - Cas d'usage spécifique  
**Estimation :** 21 points  
**Dépendances :** Stripe Subscriptions, Notification Service

---

### US-PAY013 : Paiement par virement bancaire
**En tant que** client entreprise  
**Je veux** payer par virement bancaire  
**Afin de** utiliser mon compte professionnel  

**Critères d'acceptation :**
- [ ] Option "Virement bancaire" lors de la réservation
- [ ] Affichage des coordonnées bancaires de la plateforme (IBAN, BIC, Référence unique)
- [ ] Le client reçoit un email avec les instructions de virement
- [ ] Référence unique à inclure dans le virement (pour identification automatique)
- [ ] Délai de traitement : 2-5 jours ouvrés
- [ ] Réservation en statut EN_ATTENTE jusqu'à réception du virement
- [ ] Rapprochement manuel par admin si nécessaire
- [ ] Confirmation automatique si virement détecté avec bonne référence

**Valeur métier :** BASSE - Clients professionnels uniquement  
**Estimation :** 13 points  
**Dépendances :** Système bancaire, Rapprochement bancaire

---

### US-PAY014 : Cagnotte en ligne (paiement groupé)
**En tant qu'** organisateur d'événement  
**Je veux** créer une cagnotte pour que plusieurs personnes contribuent au paiement  
**Afin de** organiser un événement de groupe (mariage, anniversaire)  

**Critères d'acceptation :**
- [ ] Création d'une cagnotte avec objectif de montant
- [ ] Génération d'un lien partageable (WhatsApp, SMS, Email)
- [ ] Chaque participant peut contribuer le montant de son choix
- [ ] Affichage en temps réel : Montant collecté / Objectif
- [ ] Liste anonyme ou publique des contributeurs (au choix de l'organisateur)
- [ ] La réservation est confirmée une fois l'objectif atteint
- [ ] Remboursement automatique si objectif non atteint avant échéance
- [ ] Option de contribution anonyme

**Valeur métier :** BASSE - Feature innovante, contexte africain (événements collectifs)  
**Estimation :** 21 points  
**Dépendances :** US-PAY001, US-PAY002, US-PAY003, Booking Service

---

### US-PAY015 : Gestion des litiges et contestations
**En tant que** client ou commerçant  
**Je veux** ouvrir un litige en cas de problème  
**Afin de** résoudre un conflit sur un paiement  

**Critères d'acceptation :**
- [ ] Le client peut ouvrir un litige depuis son espace (ex: service non rendu)
- [ ] Le commerçant peut ouvrir un litige (ex: dégradation, client absent)
- [ ] Description détaillée du litige avec pièces jointes (photos, documents)
- [ ] Notification à l'autre partie
- [ ] L'admin peut consulter tous les litiges et statuer
- [ ] Statuts : OUVERT, EN_COURS, RESOLU_FAVEUR_CLIENT, RESOLU_FAVEUR_COMMERCANT, CLOS
- [ ] Remboursement total ou partiel selon décision admin
- [ ] Historique complet des échanges

**Valeur métier :** BASSE - Gestion des cas exceptionnels  
**Estimation :** 13 points  
**Dépendances :** US-PAY007, Admin Module, Notification Service

---

### US-PAY016 : Pourboire en ligne
**En tant que** client satisfait  
**Je veux** laisser un pourboire au professionnel  
**Afin de** le remercier pour son service  

**Critères d'acceptation :**
- [ ] Option "Ajouter un pourboire" après la prestation
- [ ] Montants suggérés : 5%, 10%, 15%, Personnalisé
- [ ] Le pourboire va directement au professionnel (pas de commission)
- [ ] Notification au professionnel du pourboire reçu
- [ ] Dashboard professionnel affichant les pourboires reçus
- [ ] Paiement du pourboire via même méthode que la réservation

**Valeur métier :** BASSE - Améliore satisfaction professionnels  
**Estimation :** 8 points  
**Dépendances :** US-PAY002, US-PAY003, Service Provider

---

### US-PAY017 : Paiement différé (Buy Now, Pay Later)
**En tant que** client  
**Je veux** réserver maintenant et payer en plusieurs fois sans frais  
**Afin de** gérer mon budget plus facilement  

**Critères d'acceptation :**
- [ ] Intégration avec Klarna, Affirm ou équivalent africain
- [ ] Option "Payer en 3x ou 4x sans frais" (si montant > 100 000 FCFA)
- [ ] Vérification de solvabilité du client par le partenaire
- [ ] La plateforme reçoit le paiement immédiatement
- [ ] Le client rembourse le partenaire selon l'échéancier
- [ ] Frais gérés par le partenaire financier (transparent pour plateforme)

**Valeur métier :** BASSE - Dépend de partenaires externes  
**Estimation :** 13 points  
**Dépendances :** Partenaire BNPL (Klarna, Affirm, etc.)

---

## 📊 Récapitulatif

### Par Priorité
- **🔴 HAUTE (MVP)** : 6 stories (70 points) - 3-4 sprints
- **🟡 MOYENNE** : 5 stories (55 points) - 2-3 sprints
- **🟢 BASSE** : 6 stories (89 points) - 4-5 sprints

### Par Persona
- **Client** : 7 stories (US-PAY002, US-PAY003, US-PAY006, US-PAY008, US-PAY011, US-PAY016, US-PAY017)
- **Commerçant** : 2 stories (US-PAY007, US-PAY010)
- **Admin** : 1 story (US-PAY015)
- **Booking Service (API)** : 2 stories (US-PAY001, US-PAY005)
- **Système** : 5 stories (US-PAY004, US-PAY009, US-PAY012, US-PAY013, US-PAY014)

### Effort Total Estimé
**214 points** ≈ **9-12 sprints** (2 semaines/sprint)

---

## 🔗 Dépendances externes

- ✅ **Stripe API** : Paiements carte bancaire, Webhooks, Remboursements
- ⚠️ **Agrégateurs Mobile Money** : Intégration avec opérateurs africains (priorité HAUTE)
- ⚠️ **Booking Service** : Coordination réservations/paiements
- ⚠️ **Notification Service** : Emails, SMS confirmation/rappels
- ⚠️ **Redis** : Cache statuts paiements
- ❌ **Cloud Storage** : Stockage factures PDF (S3/Azure Blob)
- ❌ **PDF Generator** : Génération factures
- ❌ **Queue System** : Traitement asynchrone webhooks
- ❌ **Analytics Service** : Dashboards revenus
- ❌ **Partenaires BNPL** : Paiement différé

---

## 🎯 Roadmap suggérée

### Sprint 1-2 : Paiements de base (MVP Core)
- US-PAY001, US-PAY002, US-PAY005

### Sprint 3-4 : Mobile Money & Webhooks (MVP Afrique)
- US-PAY003, US-PAY004

### Sprint 5 : Factures & Remboursements
- US-PAY006, US-PAY007

### Sprint 6-7 : Commissions & Dashboards
- US-PAY008, US-PAY009, US-PAY010

### Sprint 8 : Flexibilité paiements
- US-PAY011

### Sprint 9+ : Features avancées
- US-PAY012 à US-PAY017

---

## 💡 Spécificités contexte africain

### Mobile Money - Priorité absolue
- **90% des paiements** en Afrique passent par Mobile Money
- Intégration obligatoire avec tous les opérateurs majeurs
- API instables, nécessite retry et gestion robuste des timeouts
- Confirmation asynchrone (3-5 minutes)

### Devises multiples
- Support FCFA (XOF, XAF), USD, EUR
- Taux de change dynamiques si paiement international
- Affichage clair de la devise pour éviter confusion

### Paiement sur place
- Pratique très courante (méfiance paiement en ligne)
- Option essentielle pour adoption plateforme
- Gestion manuelle par commerçant

### Événements familiaux
- Montants élevés (mariages, baptêmes)
- Paiement fractionné indispensable
- Cagnottes collectives très demandées

---

## ⚠️ Considérations techniques

### Sécurité
- Conformité PCI-DSS (Stripe gère côté carte)
- Ne jamais stocker de données bancaires sensibles
- Validation signature webhooks obligatoire
- Rate limiting endpoints paiement (anti-fraude)

### Performance
- Cache Redis pour statuts fréquemment consultés
- Timeout adapté Mobile Money (3 min max)
- Queue pour webhooks (éviter blocage)
- Retry intelligent en cas d'échec temporaire

### Monitoring
- Alertes si taux échec > 5%
- Dashboard temps réel des transactions
- Logs détaillés pour debug
- Métriques : Taux conversion, Montant moyen, Délai confirmation

---

**Dernière mise à jour** : 11 février 2026  
**Responsable Product** : Tech Lead Backend  
**Équipe** : 4 développeurs
