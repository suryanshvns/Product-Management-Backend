# Tests

API tests use Node.js built-in test runner and supertest. They hit the real app (no server) and require a **running database with migrations applied and seed data**.

## Before running tests

```bash
# Apply all migrations (creates Order, Organization, AlertRule, etc.)
npm run db:migrate

# Seed users, products, categories, etc.
npm run db:seed
```

Then:

```bash
npm test
```

## Test files

| File | APIs covered |
|------|----------------|
| `auth.test.js` | signup, login, logout, me, refresh-token |
| `health.test.js` | GET /api/health, GET /api/ping |
| `products.test.js` | products CRUD, status, stock, bulk, images |
| `categories.test.js` | categories CRUD |
| `analytics.test.js` | overview, products-by-category, top-products, inventory-status |
| `orders.test.js` | create, list, get, update status |
| `organizations.test.js` | create, list, get, members |
| `logs.test.js` | GET /api/logs |
| `notifications.test.js` | list, read-all |
| `alertRules.test.js` | alert rules CRUD |
| `reports.test.js` | sales, inventory, export products |
| `dashboard.test.js` | GET /api/dashboard/summary |
| `settings.test.js` | get, set, list |
| `apiKeys.test.js` | create, list, revoke |
| `webhooks.test.js` | webhooks CRUD |
| `bulk.test.js` | POST /api/bulk/import/products |
| `users.test.js` | GET /api/users |
| `roles.test.js` | GET /api/roles |

## Helper

- `helpers/app.js` – Express app for supertest.
- `helpers/auth.js` – `getToken()` (login as admin@company.com), `authHeader(token)`.
