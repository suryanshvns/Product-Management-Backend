# Product Management & Analytics Platform — Backend

Production-grade Node.js backend boilerplate with clean architecture. Only **health** and **ping** APIs are implemented as reference; other modules are scaffolded for you to extend.

## Structure

```
src/
  config/         # Environment and app config
  constants/       # HTTP status, error codes, route paths
  controllers/    # HTTP layer only (request/response)
  services/       # Business logic
  repositories/   # Database access
  models/         # Prisma models (see prisma/schema.prisma)
  routes/         # Express route definitions
  middlewares/    # Auth, error handling, validation, logging
  validators/     # Zod schemas for request validation
  utils/          # Logger, custom errors
  database/       # Prisma client and connection
  jobs/           # Background jobs (placeholder)
tests/
database/         # Seed script
prisma/           # Schema and migrations
```

## Implemented APIs

| Method | Path           | Description                    |
|--------|----------------|--------------------------------|
| GET    | /api/health    | App + DB health check          |
| GET    | /api/ping      | Liveness probe (pong)          |

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   ```bash
   cp .env.example .env
   # Edit .env: set DATABASE_URL, JWT_SECRET, etc.
   ```

3. **Database**

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

   For **creating the DB**, **DBeaver connection**, and **seed login credentials**, see **[docs/DATABASE_AND_DBEAVER.md](docs/DATABASE_AND_DBEAVER.md)**.

4. **Run**

   ```bash
   npm run dev
   ```

   - Health: `GET http://localhost:3000/api/health`
   - Ping: `GET http://localhost:3000/api/ping`

## Adding New Modules

For each module (e.g. products):

1. **Validator** — `src/validators/productValidators.js` (Zod schemas).
2. **Repository** — `src/repositories/productRepository.js` (Prisma calls).
3. **Service** — `src/services/productService.js` (business logic).
4. **Controller** — `src/controllers/productController.js` (call service, set res).
5. **Routes** — `src/routes/productRoutes.js` (wire routes, optionally `authenticate`, `validate`).
6. Mount in `src/routes/index.js`: `router.use(ROUTES.PRODUCTS, productRoutes)`.

## Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Validation:** Zod  
- **Auth:** JWT (middleware in place)  
- **Logging:** Pino  

## Scripts

- `npm start` — run app
- `npm run dev` — run with watch
- `npm run db:generate` — generate Prisma client
- `npm run db:migrate` — run migrations
- `npm run db:push` — push schema (dev)
- `npm run db:seed` — seed all tables with sample data
- `npm run db:reset` — reset DB, re-run migrations, then seed
- `npm test` — run tests
# Product-Management
# Product-Management-Backend
