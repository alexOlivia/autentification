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
