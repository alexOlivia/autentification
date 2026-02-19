# API Gateway - Booking System

Point d'entrée unique pour tous les microservices du système de réservation.

## 🎯 Responsabilités

- **Routage** : Redirection des requêtes vers les services appropriés
- **Authentication** : Validation des JWT et injection des infos utilisateur
- **Rate Limiting** : Protection contre les abus avec Redis
- **CORS** : Gestion des origines autorisées
- **Logging** : Logs centralisés de toutes les requêtes
- **Error Handling** : Formatage uniforme des erreurs
- **Documentation** : Swagger UI pour l'API complète
- **Health Checks** : Surveillance de l'état des services

## 🏗️ Architecture

```
Frontend/Mobile → API Gateway (Port 3000) → Microservices
                       ↓
                  - Auth (3001)
                  - Booking (3003)
                  - Accommodation (3009)
                  - Restaurant (3008)
                  - Transport (3011)
                  - Payment (3004)
                  - Notification (3005)
                  - Service Provider (3010)
                  - Resource Core (3002)
```

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- Redis (pour rate limiting)
- Tous les microservices démarrés

### Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier .env avec vos configurations

# Démarrage en mode développement
npm run dev

# Build pour production
npm run build
npm start
```

## 📝 Configuration

### Variables d'environnement (.env)

```env
# Application
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-jwt-secret-key

# Services URLs
AUTH_SERVICE_URL=http://localhost:3001
BOOKING_SERVICE_URL=http://localhost:3003
# ... autres services

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# CORS
CORS_ORIGIN=http://localhost:8080

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_TIMEWINDOW=60000
```

## 🔒 Authentification

### Flux d'authentification

1. **Login** : `POST /api/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```
   Retourne un JWT

2. **Requêtes authentifiées** : Ajouter le header
   ```
   Authorization: Bearer <jwt-token>
   ```

3. **Headers injectés** : Le Gateway ajoute automatiquement
   ```
   x-user-id: 123
   x-user-email: user@example.com
   x-user-role: client|provider|admin
   ```

### Routes publiques (pas d'auth requise)

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/accommodations` (liste publique)
- `GET /api/restaurants` (liste publique)
- `GET /api/transports` (liste publique)
- `GET /health`
- `GET /docs`

### Routes protégées (auth requise)

- `GET /api/bookings` (mes réservations)
- `POST /api/bookings` (créer une réservation)
- `GET /api/payments` (mes paiements)
- Toutes les routes `/api/notifications`

## 📡 Routes disponibles

### Health Checks

```bash
# Simple health check
GET /health

# Detailed health check avec status des services
GET /health/detailed

# Kubernetes probes
GET /ready
GET /live
```

### Documentation

```bash
# Swagger UI
GET /docs

# OpenAPI JSON
GET /docs/json
```

### Microservices (proxies)

```bash
# Auth Service
/api/auth/*

# Booking Service
/api/bookings/*

# Accommodation Service
/api/accommodations/*

# Restaurant Service
/api/restaurants/*

# Transport Service
/api/transports/*

# Payment Service
/api/payments/*

# Notification Service
/api/notifications/*

# Service Provider
/api/providers/*

# Resource Core
/api/resources/*
```

## 🛡️ Rate Limiting

- **Par défaut** : 100 requêtes / minute par utilisateur ou IP
- **Stockage** : Redis
- **Réponse** : HTTP 429 avec `Retry-After` header

Configuration dans `.env` :
```env
RATE_LIMIT_MAX=100
RATE_LIMIT_TIMEWINDOW=60000
```

## 📊 Logging

Tous les logs incluent :
- Méthode HTTP
- URL
- Status code
- Durée de la requête
- User ID (si authentifié)
- IP address
- User Agent

Format JSON en production, pretty print en développement.

## 🐳 Docker

### Build

```bash
docker build -t api-gateway .
```

### Run

```bash
docker run -p 3000:3000 \
  --env-file .env \
  api-gateway
```

### Docker Compose (voir infrastructure/)

```bash
docker-compose up api-gateway
```

## 🧪 Tests

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 📚 Structure du projet

```
api-gateway/
├── src/
│   ├── app.ts              # Configuration Fastify
│   ├── server.ts           # Point d'entrée
│   ├── config/
│   │   ├── env.ts          # Variables d'environnement
│   │   └── services.ts     # Configuration des services
│   ├── middleware/
│   │   ├── auth.ts         # Authentification JWT
│   │   ├── rateLimit.ts    # Rate limiting
│   │   ├── cors.ts         # CORS
│   │   ├── logger.ts       # Logging
│   │   └── errorHandler.ts # Gestion d'erreurs
│   ├── routes/
│   │   ├── health.ts       # Health checks
│   │   └── proxy.ts        # Configuration des proxies
│   └── utils/
│       ├── jwt.ts          # JWT helpers
│       ├── errors.ts       # Custom errors
│       └── logger.ts       # Logger configuration
├── tests/
├── Dockerfile
├── .env.example
├── package.json
└── tsconfig.json
```

## 🔧 Scripts NPM

```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build TypeScript
npm start            # Démarrage en production
npm run lint         # Lint du code
npm test             # Tests
npm run test:watch   # Tests en watch mode
```

## 🚨 Erreurs

Format standardisé des erreurs :

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "statusCode": 401,
    "timestamp": "2026-02-09T10:30:00Z",
    "path": "/api/bookings"
  }
}
```

Codes d'erreur communs :
- `400` : Bad Request
- `401` : Unauthorized
- `403` : Forbidden
- `404` : Not Found
- `429` : Too Many Requests
- `500` : Internal Server Error
- `503` : Service Unavailable

## 📈 Monitoring

### Métriques disponibles

- Nombre de requêtes par service
- Temps de réponse moyen
- Taux d'erreurs
- Santé des services downstream

### Health Check avec Docker

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1
```

## 🔐 Sécurité

-   Helmet.js pour les headers de sécurité
-   CORS strictement configuré
-   Rate limiting par utilisateur/IP
-   JWT avec expiration
-   Validation des inputs avec Zod
-   Logs de toutes les requêtes
-   Pas d'exposition directe des services

## 🤝 Contribution

Voir [CONTRIBUTING.md](../../CONTRIBUTING.md) pour les conventions de commit et workflow Git.

## 📞 Support

En cas de problème :
1. Vérifier les logs : `docker logs api-gateway`
2. Vérifier la santé des services : `GET /health/detailed`
3. Consulter la documentation Swagger : `/docs`
4. Créer une issue avec le label `api-gateway`

## 📄 License

ISC
