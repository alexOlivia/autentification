# Architecture Technique - BookingSysteme

## Vue d'ensemble
Système de réservation multi-services basé sur une architecture microservices avec API Gateway.

## Stack Technique
- **Runtime**: Node.js / TypeScript
- **Framework**: Fastify
- **BDD**: PostgreSQL
- **Cache**: Redis
- **Communication**: REST API + WebSocket
- **Documentation**: Swagger/OpenAPI

---

## Services & Ports

### 🌐 Gateway
| Service | Port | Rôle |
|---------|------|------|
| **API Gateway** | `3000` | Point d'entrée unique, routage, authentification, rate limiting |

#### Flux de communication
Client (Mobile/Web) → API Gateway (3000) → Services métier → PostgreSQL/Redis

### 🔐 Core Services
| Service | Port | Responsabilité |
|---------|------|----------------|
| **Auth Service** | `3001` | Authentification, autorisation, gestion utilisateurs, JWT |

#### Flux de communication
Client → API Gateway (3000) → Auth Service (3001) → PostgreSQL (5432)/Redis (6379)
| **Resource Core** | `3002` | Gestion centralisée des ressources partagées |

#### Flux de communication
Services métier → Resource Core (3002) → PostgreSQL (5432)

### 📦 Business Services
| Service | Port | Domaine métier |
|---------|------|----------------|
| **Booking Service** | `3003` | Orchestration des réservations |

#### Flux de communication
Client → API Gateway (3000) → Booking Service (3003) → PostgreSQL (5432)/Redis (6379)
| **Payment Service** | `3004` | Transactions, paiements, facturation |

#### Flux de communication
Client → API Gateway (3000) → Payment Service (3004) → PostgreSQL (5432)
| **Notification Service** | `3005` | Emails, SMS, push notifications |

#### Flux de communication
Services métier → Notification Service (3005) → Email/SMS/Push
| **Restaurant Service** | `3008` | Gestion restaurants, menus, commandes |

#### Flux de communication
Client → API Gateway (3000) → Restaurant Service (3008) → PostgreSQL (5432)
| **Accommodation Service** | `3009` | Hébergements, chambres, disponibilités |

#### Flux de communication
Client → API Gateway (3000) → Accommodation Service (3009) → PostgreSQL (5432)
| **Service Provider** | `3010` | Gestion des prestataires marchands |

#### Flux de communication
Client → API Gateway (3000) → Service Provider (3010) → PostgreSQL (5432)
| **Transport Service** | `3011` | Véhicules, trajets, réservations transport |

#### Flux de communication
Client → API Gateway (3000) → Transport Service (3011) → PostgreSQL (5432)

### 🗄️ Infrastructure
| Composant | Port | Usage |
|-----------|------|-------|
| **PostgreSQL** | `5432` | Base de données principale (chaque service a sa propre DB) |
| **Redis** | `6379` | Cache, sessions, rate limiting, pub/sub(chaque service a sa propre cache ) ||

---

## Flux de communication

```
Client (Mobile)
    ↓
API Gateway (3000) → Redis (6379)
    ↓
[Auth → Services métier → Notification]
    ↓
PostgreSQL (5432)
```

### Pattern de communication
- **Sync**: HTTP/REST via API Gateway
- **Async**: Redis Pub/Sub pour événements
- **Real-time**: WebSocket pour notifications temps réel

---

## Sécurité
- JWT avec refresh tokens
- Rate limiting (100 req/min par défaut)
- CORS configuré
- Helmet.js pour headers sécurisés
- Authentification centralisée via Auth Service

---

## Scalabilité
- Chaque service est containerisable (Dockerfile)
- Orchestration Kubernetes prévue
- Cache Redis pour performance
- Load balancing au niveau Gateway

---
