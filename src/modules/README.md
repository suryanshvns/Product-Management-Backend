# Application modules (domain-driven layout)

Code is grouped by **business domain**, not by technical layer. Each module owns its HTTP routes, controllers, services, repositories, and validators.

## Naming

- **Folders:** `kebab-case` domain names (e.g. `customer-management`, `access-control`).
- **Files:** `<feature>.<layer>.js` — e.g. `order.service.js`, `product.repository.js`, `auth.routes.js`.

## Modules

| Module | Responsibility |
|--------|----------------|
| **authentication** | Signup, login, logout, refresh token, sessions |
| **user-management** | User CRUD and profiles |
| **access-control** | Roles and role assignment |
| **organization-management** | Organizations and members |
| **catalog** | Products, categories, variants, tags, inventory batches, related products, catalog search |
| **commerce** | Orders, coupons, invoices |
| **customer-management** | Customers, customer groups, addresses, quotes |
| **engagement** | Product reviews, wishlists |
| **pricing** | Price lists and variant pricing |
| **analytics** | Analytics events and reporting APIs |
| **platform** | Health, activity logs, notifications, alert rules, reports, dashboard, settings, API keys, webhooks, bulk import |

## Shared infrastructure (outside `modules/`)

`src/config`, `src/database`, `src/middlewares`, `src/utils`, `src/constants`, and `src/routes/index.js` (API composition) stay as cross-cutting concerns.

## Entry point

`src/routes/index.js` mounts each module’s router under `/api` using `constants/routes.js`.
