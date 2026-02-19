# Diagrammes Techniques UML - Plateforme PING

Ce dossier contient les diagrammes UML techniques (architecture d'implémentation) de la plateforme de réservation multi-ressources PING.

> **Note :** Pour une vue purement conceptuelle du domaine métier, consulter le dossier [`../diagrammes-conceptuels/`](../diagrammes-conceptuels/)

## 📁 Organisation des diagrammes

### Structure du projet

```
NouvelleBase/
├── diagrammes/                    # ← Vous êtes ici (Vue TECHNIQUE)
│   ├── auth-service/
│   │   └── classe.puml            # Architecture technique complète
│   ├── resource-core-service/
│   │   └── classe.puml
│   ├── restaurant-service/
│   │   └── classe.puml
│   ├── accommodation-service/
│   │   └── classe.puml
│   ├── service-provider-service/
│   │   └── classe.puml
│   ├── transport-service/
│   │   └── classe.puml
│   ├── booking-service/
│   │   └── classe.puml
│   ├── payment-service/
│   │   └── classe.puml
│   ├── notification-service/
│   │   └── classe.puml
│   └── global/
│       ├── interoperabilite.puml  # Architecture microservices
│       └── deploiement.puml       # Infrastructure Docker
│
└── diagrammes-conceptuels/        # Vue CONCEPTUELLE (domaine métier)
    ├── auth-service/
    │   └── modele-domaine.puml    # Entités et règles métier
    ├── [autres services...]
    └── global/
        └── interoperabilite-services.puml
```

### Différence Technique vs Conceptuel

| Aspect | Diagrammes Techniques | Diagrammes Conceptuels |
|--------|-----------------------|------------------------|
| **Public cible** | Développeurs, architectes | Business analysts, PO, stakeholders |
| **Contenu** | Contrôleurs, Services, Dépôts, DTOs, Validateurs | Entités métier, Relations, Règles business |
| **Niveau détail** | Implémentation complète (méthodes, types) | Modèle de domaine (attributs métier) |
| **Focus** | Comment implémenter ? | Qu'est-ce que le système fait ? |
| **Technologies** | Fastify, Prisma, Redis, PostgreSQL | Agnostique |

##  Contenu des diagrammes techniques

### Diagrammes de Classes (classe.puml)

Chaque service contient un diagramme de classes technique complet incluant :

**Couche Infrastructure**
- `Serveur[Service]` - Configuration FastifyInstance, routes, démarrage
- Middlewares d'authentification et validation

**Couche Présentation**
- `Controleur[Domaine]` - Endpoints REST, validation requêtes
- DTOs (Data Transfer Objects) pour requêtes/réponses

**Couche Application**
- `Service[Domaine]` - Logique métier, orchestration
- Services techniques (JWT, Hash, Cache, Email, SMS)
- Validateurs métier

**Couche Domaine**
- Entités métier (avec stéréotype <<entite>>)
- Enums (tous enrichis avec valeur AUTRE)
- Value Objects

**Couche Persistance**
- `Depot[Entite]` - Repositories Prisma ORM
- Schémas de base de données PostgreSQL

**Services Externes**
- Clients API (Stripe, SendGrid, Firebase, Twilio)
- Configuration et wrappers

### Diagrammes Globaux

**interoperabilite.puml**
- Architecture microservices complète (10 services)
- API Gateway avec patterns de résilience
- Communication HTTP REST synchrone
- Événements Redis Pub/Sub asynchrones
- WebSocket temps réel (Socket.io)
- Accès bases de données (PostgreSQL, Redis)
- Services externes (Stripe, SendGrid, Firebase, Twilio)

**deploiement.puml**
- Infrastructure Docker (conteneurs, réseaux, volumes)
- Scalabilité horizontale
- Configuration déploiement

##  Comment visualiser les diagrammes

### Option 1 : VSCode avec PlantUML Extension (Recommandé)

1. Installer l'extension **PlantUML** par jebbs
2. Ouvrir un fichier `.puml`
3. Appuyer sur `Alt + D` pour prévisualiser
4. Ou clic droit → "Preview Current Diagram"

### Option 2 : PlantUML Server Online

1. Aller sur https://www.plantuml.com/plantuml/uml/
2. Copier-coller le contenu d'un fichier `.puml`
3. Visualiser le rendu

### Option 3 : CLI PlantUML

```bash
# Installation
npm install -g node-plantuml

# Générer PNG
puml generate diagrammes/api-gateway/classe.puml -o output/

# Générer SVG (vectoriel, meilleure qualité)
puml generate diagrammes/**/*.puml -t svg -o output/
```

### Option 4 : Générer tous les diagrammes en batch

```bash
# Créer script generate-diagrams.sh
#!/bin/bash
for file in diagrammes/**/*.puml; do
  plantuml "$file" -tpng -o "$(dirname "$file")/generated"
done

# Exécuter
chmod +x generate-diagrams.sh
./generate-diagrams.sh
```

##  Guide de lecture par service

### 1. API Gateway (Port 3000)
**Rôle :** Point d'entrée unique, routage, authentification, rate limiting

**Consulter :**
- `classe.puml` → Architecture du gateway (middlewares, circuit breaker)
- `sequence.puml` → Flow complet d'une requête avec validation JWT
- `cas-utilisation.puml` → Fonctionnalités (routing, rate limiting, health checks)

**Points clés :**
- Circuit Breaker avec Opossum
- Rate Limiting Redis (100 req/15min)
- Cache pour résilience
- Load Balancing Round Robin

---

### 2. Auth Service (Port 3001)
**Rôle :** Authentification, gestion utilisateurs, sessions, permissions (RBAC)

**Architecture technique :**
- **Entités** : Utilisateur, TokenAcces, SessionUtilisateur, TentativeConnexion, CodeVerification, Permission
- **Services** : ServiceAuth, ServiceJWT, ServiceHash, ServiceRBAC, ServiceSession, ServiceVerification, ServiceSMS, ServiceEmail
- **Dépôts** : DepotUtilisateur, DepotTokenAcces, DepotSessionUtilisateur, DepotTentativeConnexion, DepotCodeVerification, DepotPermission

**Points clés :**
- JWT (access 15min, refresh 7j, reset password 1h, email verification 24h)
- Bcrypt avec 10 salt rounds
- RBAC complet : CLIENT, COMMERCANT, ADMIN, SUPER_ADMIN
- Multi-sessions (mobile, web, tablette)
- Vérification SMS/Email (codes 6 chiffres)
- Détection attaques (rate limiting >5 échecs/15min)
- Contexte africain : téléphone obligatoire, SMS prioritaire

---

### 3. Resource Core Service (Port 3002)
**Rôle :** Gestion commerçants, horaires, avis, documents légaux, médias

**Architecture technique :**
- **Entités** : Commercant, Horaire, JourFerie, Avis, MediaCommercant, DocumentLegal, ParametresCommercant, Adresse
- **Services** : ServiceCommercant, ServiceHoraire, ServiceAvis, ServiceMedia, ServiceValidation
- **Dépôts** : DepotCommercant, DepotHoraire, DepotJourFerie, DepotAvis, DepotMediaCommercant, DepotDocumentLegal

**Points clés :**
- Service partagé par tous les services métier
- Gestion complète profils commerçants (4 types : RESTAURANT, HEBERGEMENT, SERVICE_PROVIDER, TRANSPORT)
- Système d'avis vérifiés avec réponses
- Documents légaux (registre commerce, licences, assurances)
- Upload médias (photos, vidéos, logos)
- Paramètres métier (devise XOF, fuseauHoraire, politique annulation)

---

### 4. Restaurant Service (Port 3008)
**Rôle :** Gestion restaurants, tables, zones, périodes de service

**Architecture technique :**
- **Entités** : Restaurant, Table, Zone, PeriodeService
- **Services** : ServiceRestaurant, ServiceTable, ServiceZone, ServiceDisponibilite
- **Dépôts** : DepotRestaurant, DepotTable, DepotZone, DepotPeriodeService

**Points clés :**
- Tables numérotées avec formes (RONDE, CARREE, RECTANGULAIRE, OVALE, HAUTE)
- Capacité modulable (min-max) pour regroupements
- Zones multiples (INTERIEUR, TERRASSE, ESPACE_GRILLADE, VIP, BAR, JARDIN, SALLE_PRIVEE)
- Périodes service (PETIT_DEJEUNER, DEJEUNER, GOUTER, DINER, BRUNCH)
- Réservation complète établissement pour événements
- Contexte africain : espaces grillades (dibi, méchoui), terrasses prisées

---

### 5. Accommodation Service (Port 3009)
**Rôle :** Gestion hébergements multi-ressources (chambres, salles, jardins, piscines)

**Architecture technique :**
- **Entités** : Hebergement, Chambre, Salle, Jardin, Piscine, Equipement, RegleTarif
- **Services** : ServiceHebergement, ServiceChambre, ServiceTarification, ServiceEquipement, ServiceDisponibilite
- **Dépôts** : DepotHebergement, DepotChambre, DepotSalle, DepotJardin, DepotPiscine, DepotEquipement, DepotRegleTarif

**Points clés :**
- **Multi-ressources** : chambres (nuitées), salles événements (heure/jour), jardins, piscines (créneaux)
- **Tarification générique** : RegleTarif polymorphe avec modes (NUITEE, HEURE, JOURNEE, CRENEAU, FORFAIT)
- **Équipements génériques** : système unifié pour toutes ressources (TypeRessource: CHAMBRE, SALLE, JARDIN, PISCINE)
- **Types enrichis** : 12 types chambres, 8 types lits, 10 types salles, dispositions multiples
- **Contexte africain** : climatisation, moustiquaires, eau chaude, générateurs, jardins événements

---

### 6. Service Provider Service (Port 3010)
**Rôle :** Gestion établissements de prestations, prestataires, services, créneaux

**Architecture technique :**
- **Entités** : Etablissement, Prestataire, Service, CreneauDisponibilite, Promotion
- **Services** : ServiceEtablissement, ServicePrestataire, ServiceService, ServiceCreneau, ServicePromotion
- **Dépôts** : DepotEtablissement, DepotPrestataire, DepotService, DepotCreneauDisponibilite, DepotPromotion

**Points clés :**
- **12 types services** : COIFFURE, BARBIER, ESTHETIQUE, SPA, MASSAGE, MANUCURE_PEDICURE, MAQUILLAGE, TRESSAGE, etc.
- **17 catégories détaillées** : COUPE_HOMME, NATTES_AFRICAINES, TRESSES_SENEGALAISES, DEFRISAGE, TISSAGE, etc.
- Prestataires avec spécialités (coiffeur afro, masseuse, photographe)
- Créneaux avec capacité simultanée et récurrence
- Promotions (POURCENTAGE, MONTANT_FIXE)
- Contexte africain : tressage, nattes, services spécifiques

---

### 7. Booking Service (Port 3003) ⭐ **SERVICE CŒUR**
**Rôle :** Orchestrateur central de toutes les réservations multi-domaines

**Architecture technique :**
- **Entités** : Reservation, Participant, PolitiqueAnnulation, ConflitReservation, SuggestionAlternative, HistoriqueStatut
- **Services** : ServiceReservation, ServiceConflits, ServiceSuggestions, ServiceParticipants, ServiceOptimisation, ServiceWebSocket
- **Dépôts** : DepotReservation, DepotParticipant, DepotPolitiqueAnnulation, DepotConflitReservation, DepotSuggestionAlternative

**Points clés :**
- **Réservations polymorphes** : 10 types ressources (TABLE_RESTAURANT, CHAMBRE, SALLE_EVENEMENT, CRENEAU_SERVICE, PLACE_TRANSPORT, VEHICULE_VTC, etc.)
- **Anti-double-booking** : détection conflits temps réel (CHEVAUCHEMENT_HORAIRE, SURRESERVATION, INDISPONIBILITE_RESSOURCE, INDISPONIBILITE_PERSONNEL)
- **Suggestions intelligentes** : alternatives automatiques multi-critères (date, prix, localisation, caractéristiques)
- **Cycle complet** : EN_ATTENTE_PAIEMENT → CONFIRMEE → EN_COURS → TERMINEE → ANNULEE_CLIENT/COMMERCANT
- **Participants multiples** : gestion groupe pour réservations
- **WebSocket temps réel** : mises à jour instantanées disponibilités

---

### 8. Payment Service (Port 3004)
**Rôle :** Paiements multi-méthodes, remboursements, facturation, Mobile Money

**Architecture technique :**
- **Entités** : Paiement, Remboursement, Facture, LigneFacture, TransactionMobileMoney, WebhookEvent
- **Services** : ServicePaiement, ServiceRemboursement, ServiceFacture, ServiceWebhook, ServiceMobileMoney
- **Dépôts** : DepotPaiement, DepotRemboursement, DepotFacture, DepotTransactionMobileMoney, DepotWebhookEvent

**Points clés :**
- **Multi-méthodes** : CARTE_BANCAIRE, MOBILE_MONEY, ESPECES, CHEQUE
- **Mobile Money africain** : ORANGE_MONEY, MTN_MOBILE_MONEY, MOOV_MONEY, WAVE, TELECEL_MONEY, FREE_MONEY
- **Types paiement** : ACOMPTE, PAIEMENT_COMPLET, SOLDE, SUPPLEMENT
- **Intégration Stripe** : PaymentIntent API, webhooks sécurisés HMAC-SHA256
- **Remboursements intelligents** : politiques variables selon délai annulation
- **Facturation complète** : lignes détaillées, TVA, totaux, devises multiples (XOF, XAF, NGN, EUR, USD)
- **Tracking transactions** : historique complet, statuts, retry automatique

---

### 9. Notification Service (Port 3005)
**Rôle :** Notifications multi-canal événementielles

**Architecture technique :**
- **Entités** : Notification, TemplateNotification, PreferenceNotification, TokenPush, HistoriqueEnvoi
- **Services** : ServiceNotification, DispatcheurNotification, ServiceEmail, ServicePush, ServiceSMS, ServiceTemplate
- **Dépôts** : DepotNotification, DepotTemplateNotification, DepotPreferenceNotification, DepotTokenPush, DepotHistoriqueEnvoi

**Points clés :**
- **Multi-canal** : EMAIL (SendGrid), PUSH (Firebase FCM), SMS (Twilio), IN_APP
- **10 types notifications** : RESERVATION_CONFIRMEE, PAIEMENT_REUSSI, RAPPEL_RESERVATION, DEMANDE_AVIS, NOUVEAU_MESSAGE, etc.
- **Priorités** : URGENTE (immédiat), HAUTE (<1min), NORMALE (<5min), BASSE (batch horaire)
- **Événements Redis** : écoute booking.*, payment.*, auth.* (Pub/Sub)
- **Templates multi-langues** : FR, EN, WO (Wolof), BM (Bambara) avec variables dynamiques
- **Préférences granulaires** : par type notification et canal
- **Tracking complet** : HistoriqueEnvoi avec statuts, retry, métriques performance
- **Contexte africain** : SMS prioritaire (>95% livraison, ~50 XOF/SMS)

### 10. Transport Service (Port 3011)
**Rôle :** Gestion transport multimodal (bus, train, avion, VTC)

**Architecture technique :**
- **Entités** : Vehicule, Ligne, Trajet, Place, Chauffeur, Billet, Tarification, CourseVTC
- **Services** : ServiceVehicule, ServiceLigne, ServiceTrajet, ServiceReservationPlace, ServiceChauffeur, ServiceItineraire
- **Dépôts** : DepotVehicule, DepotLigne, DepotTrajet, DepotPlace, DepotChauffeur, DepotBillet, DepotTarification

**Points clés :**
- **Multimodal** : BUS, TRAIN, AVION, METRO, MINIBUS, TAXI, BATEAU, VTC
- **Places numérotées** : gestion sièges avec positions, types (STANDARD, PREMIUM, VIP), disponibilité
- **Classes tarifaires** : ECONOMIQUE, CONFORT, PREMIERE, VIP
- **Trajets complexes** : arrêts intermédiaires, durées, distances Haversine
- **VTC intégré** : courses privées avec chauffeurs, tarification dynamique
- **Contexte africain** : routes non cartographiées, compagnies informelles, langues locales

---

##  Vue d'ensemble : Diagrammes globaux

### Interopérabilité (`global/interoperabilite.puml`)
**Architecture microservices complète**

Illustre :
- **10 microservices** avec leurs responsabilités
- **API Gateway** (port 3000) : routage, auth middleware, circuit breaker, load balancer
- **Flux HTTP REST** : appels synchrones entre services
- **Redis Pub/Sub** : événements asynchrones (booking.*, payment.*)
- **WebSocket** : temps réel Socket.io (booking service)
- **PostgreSQL** : 10 schemas isolés (Database per Service pattern)
- **Redis** : cache (TTL 5-15min) + pub/sub centralisé
- **Services externes** : Stripe, SendGrid, Firebase FCM, Twilio
- **Patterns résilience** : Circuit Breaker (Opossum), Cache fallback, Retry exponential backoff

**À consulter en premier** pour comprendre l'orchestration globale.

### Déploiement (`global/deploiement.puml`)
**Infrastructure Docker et configuration**

Détaille :
- 10 conteneurs services avec ports
- PostgreSQL (10 schemas, connexion pooling)
- Redis (cache + pub/sub)
- Réseau Docker isolé
- Volumes persistants
- Variables d'environnement
- Scalabilité horizontale

**À consulter** pour le déploiement et DevOps.

---

## 🎨 Légende des couleurs

Les diagrammes utilisent des couleurs pour différencier les types de composants :

| Couleur | Type | Exemple |
|---------|------|---------|
| 🔵 Bleu clair | API Gateway | Point d'entrée |
| 🟢 Vert clair | Auth Service | Authentification |
| 🟡 Jaune clair | Resource Services | Gestion ressources |
| 🔴 Corail | Restaurant Service | Tables |
| 🔵 Cyan | Accommodation Service | Chambres |
| 🟤 Wheat | Service Provider Service | Créneaux |
| 🟠 Saumon | Booking Service | Réservations (cœur) |
| 🟢 Vert pâle | Payment Service | Paiements |
| 🟣 Lavande | Notification Service | Notifications |

---

##  Conventions de notation

### Diagrammes de Classes

```plantuml
class NomClasse <<stereotype>> {
    + attributPublic: type
    - attributPrive: type
    # attributProtege: type
    + methodePublique(): type
    - methodePrive(): type
}

enum NomEnum {
    VALEUR1
    VALEUR2
}

<<entite>> = Entité base de données
<<dto>> = Data Transfer Object
<<value object>> = Value Object (immutable)
<<pattern>> = Design pattern
```

### Relations

- `--` : Association
- `-->` : Dépendance
- `--|>` : Héritage
- `--*` : Composition
- `--o` : Agrégation
- `..>` : Utilisation

### Cardinalités

- `"1"` : Exactement 1
- `"*"` : 0 à plusieurs
- `"1..*"` : 1 à plusieurs
- `"0..1"` : 0 ou 1

### Diagrammes de Séquence

- `->` : Appel synchrone
- `-->` : Retour
- `--x` : Échec/Erreur
- `activate/deactivate` : Période d'activité
- `alt/else/end` : Condition
- `loop/end` : Boucle
- `par/end` : Parallèle

---

##  Cas d'usage des diagrammes

### Scénario 1 : Je veux comprendre comment fonctionne la création d'une réservation

1. Consulter `booking-service/sequence.puml` → Flow complet
2. Consulter `booking-service/classe.puml` → Structure DetecteurConflits
3. Consulter `restaurant-service/sequence.puml` → Vérification disponibilité table
4. Consulter `payment-service/sequence.puml` → Processus paiement
5. Consulter `notification-service/sequence.puml` → Envoi confirmation

### Scénario 2 : Je dois implémenter l'API Gateway

1. Consulter `api-gateway/classe.puml` → Architecture complète
2. Consulter `api-gateway/sequence.puml` → Flow requête avec JWT
3. Consulter `api-gateway/cas-utilisation.puml` → Fonctionnalités requises
4. Consulter `global/interoperabilite.puml` → Communication avec services backend

### Scénario 3 : Je veux comprendre l'architecture globale

1. Consulter `global/interoperabilite.puml` → Vue d'ensemble services
2. Consulter `global/deploiement.puml` → Infrastructure Docker
3. Consulter `README.md` (ce fichier) → Documentation
4. Consulter chaque service individuellement selon besoin

---

## 📚 Ressources supplémentaires

### Documentation projet
- [`../README.md`](../README.md) - Vue d'ensemble projet
- [`../docs/architecture/ARCHITECTURE.md`](../docs/architecture/ARCHITECTURE.md) - Architecture détaillée
- [`../docs/context.md`](../docs/context.md) - Contexte projet

### PlantUML
- [PlantUML Documentation](https://plantuml.com/)
- [PlantUML Cheat Sheet](https://plantuml.com/guide)
- [Real World PlantUML](https://real-world-plantuml.com/)

### Microservices Patterns
- [Microservices.io Patterns](https://microservices.io/patterns/)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Database per Service](https://microservices.io/patterns/data/database-per-service.html)

---

## 🤝 Contribution

### Modifier un diagramme existant

1. Ouvrir le fichier `.puml` dans VSCode
2. Modifier le contenu
3. Prévisualiser avec `Alt + D`
4. Committer les changements

### Créer un nouveau diagramme

1. Respecter la structure de dossiers
2. Utiliser les conventions de nommage
3. Ajouter des notes explicatives
4. Mettre à jour ce README si nécessaire

### Conventions

- **Langue :** Français pour les attributs, méthodes et notes
- **Format :** PlantUML avec skin param pour cohérence visuelle
- **Notes :** Ajouter des notes pour expliquer les patterns et décisions importantes
- **Couleurs :** Utiliser les couleurs définies pour chaque service



---

## 📌 Principes d'harmonisation appliqués

Les diagrammes techniques ont été harmonisés avec les diagrammes conceptuels selon les principes suivants :



### Enums enrichis
- **AUTRE ajouté partout** : tous les 61 enums incluent la valeur AUTRE pour extensibilité


### Architecture complète
- **Couches distinctes** : Infrastructure → Présentation → Application → Domaine → Persistance
- **Patterns identifiés** : Repository, Service Layer, DTO, Value Object
- **Technologies explicites** : Fastify, Prisma ORM, PostgreSQL, Redis

### 10 services harmonisés à 100%
 Auth Service •  Resource Core •  Restaurant •  Accommodation •  Service Provider
 Transport •  Booking •  Payment •  Notification •  Global

---

**Date de dernière mise à jour :** 2026-02-06
**Version :** 2.0.0 (Harmonisation complète)
**Projet :** PING Service - Plateforme de Réservation Multi-Ressources
