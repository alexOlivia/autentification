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



