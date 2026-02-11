# Transport Service

## Overview
The Transport Service is a microservice designed to manage transportation operations, including vehicles, trips, seats, lines, and drivers. It utilizes modern technologies such as TypeScript, Fastify, Prisma with PostgreSQL, Redis for caching, and Socket.io for real-time communication.

## Technologies Used
- **TypeScript**: A superset of JavaScript that adds static types.
- **Fastify**: A fast and low-overhead web framework for Node.js.
- **Prisma**: An ORM for Node.js and TypeScript that simplifies database interactions.
- **PostgreSQL**: A powerful, open-source relational database.
- **Redis**: An in-memory data structure store used as a database, cache, and message broker.
- **Socket.io**: A library for real-time web applications, enabling real-time, bidirectional communication.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **JWT (JSON Web Tokens)**: A compact, URL-safe means of representing claims to be transferred between two parties.

## Project Structure
```
transport-service
├── src
│   ├── app.ts
│   ├── server
│   │   ├── index.ts
│   │   ├── fastify.ts
│   │   └── sockets.ts
│   ├── controllers
│   │   ├── vehicule.controller.ts
│   │   ├── trajet.controller.ts
│   │   ├── place.controller.ts
│   │   ├── ligne.controller.ts
│   │   └── chauffeur.controller.ts
│   ├── services
│   │   ├── vehicule.service.ts
│   │   ├── trajet.service.ts
│   │   ├── place.service.ts
│   │   ├── ligne.service.ts
│   │   └── chauffeur.service.ts
│   ├── repositories
│   │   ├── vehicule.repository.ts
│   │   ├── trajet.repository.ts
│   │   ├── place.repository.ts
│   │   ├── ligne.repository.ts
│   │   ├── arret.repository.ts
│   │   └── chauffeur.repository.ts
│   ├── dto
│   │   ├── vehicule.dto.ts
│   │   ├── trajet.dto.ts
│   │   └── place.dto.ts
│   ├── validators
│   │   ├── vehicule.schema.ts
│   │   ├── trajet.schema.ts
│   │   └── place.schema.ts
│   ├── routes
│   │   ├── index.ts
│   │   ├── vehicule.routes.ts
│   │   ├── trajet.routes.ts
│   │   └── auth.routes.ts
│   ├── middlewares
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── lib
│   │   ├── prisma.ts
│   │   ├── redis.ts
│   │   ├── jwt.ts
│   │   └── logger.ts
│   ├── clients
│   │   ├── resourceCore.client.ts
│   │   └── booking.client.ts
│   ├── cache
│   │   └── availability.cache.ts
│   ├── utils
│   │   └── calculateurItineraire.ts
│   ├── sockets
│   │   └── realtime.ts
│   ├── types
│   │   └── index.ts
│   └── tests
│       ├── unit
│       └── e2e
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── docker
│   └── docker-compose.yml
├── scripts
│   ├── migrate.sh
│   └── start.sh
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd transport-service
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up the environment**:
   Copy `.env.example` to `.env` and configure your environment variables.

4. **Run migrations**:
   ```
   npm run migrate
   ```

5. **Start the application**:
   ```
   npm run start
   ```

## API Documentation
Refer to the API documentation for details on available endpoints, request/response formats, and authentication methods.

## License
This project is licensed under the MIT License. See the LICENSE file for details.