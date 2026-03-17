# API tests

Run: `npm test` (requires DB seeded: `npm run db:seed`).

| File | APIs covered |
|------|----------------|
| `auth.test.js` | `/api/auth/*` |
| `health.test.js` | `/api/health`, `/api/ping` |
| `users.test.js` | `/api/users` |
| `roles.test.js` | `/api/roles` |
| `categories.test.js` | `/api/categories` |
| `products.test.js` | `/api/products` |
| `orders.test.js` | `/api/orders` (incl. shipping, coupon, status workflow) |
| `organizations.test.js` | `/api/organizations` |
| `analytics.test.js` | `/api/analytics` |
| `notifications.test.js` | `/api/notifications` |
| `logs.test.js` | `/api/logs` |
| `alertRules.test.js` | `/api/alert-rules` |
| `reports.test.js` | `/api/reports` |
| `dashboard.test.js` | `/api/dashboard` |
| `settings.test.js` | `/api/settings` |
| `apiKeys.test.js` | `/api/api-keys` |
| `webhooks.test.js` | `/api/webhooks` |
| `bulk.test.js` | `/api/bulk` |
| **`catalog-advanced.test.js`** | `/api/search/products`, `/api/product-variants`, `/api/tags`, `/api/inventory-batches`, `/api/related-products` |
| **`coupons-invoices.test.js`** | `/api/coupons`, `/api/invoices` |
| **`customers-quotes.test.js`** | `/api/customer-groups`, `/api/customers`, `/api/customer-addresses`, `/api/quotes` |
| **`engagement.test.js`** | `/api/reviews`, `/api/wishlist` |
| **`price-lists.test.js`** | `/api/price-lists` |

Helpers: `helpers/app.js`, `helpers/auth.js` (admin token + `authHeader`).
