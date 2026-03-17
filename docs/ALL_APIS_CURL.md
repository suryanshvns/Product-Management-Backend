# All APIs – cURL Reference (Frontend Integration Checklist)

**Base URL:** `http://localhost:3000/api`

**Get token (use for authenticated requests):**
```bash
export TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"test"}' | jq -r '.data.accessToken')
# Use: -H "Authorization: Bearer $TOKEN"
# Or API key: -H "X-API-Key: YOUR_API_KEY"
```

---

## Quick checklist (all endpoints)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 1 | GET | /api/health | No | Health check |
| 2 | GET | /api/ping | No | Ping |
| 3 | POST | /api/auth/signup | No | Sign up |
| 4 | POST | /api/auth/login | No | Login |
| 5 | POST | /api/auth/logout | Yes | Logout |
| 6 | GET | /api/auth/me | Yes | Current user |
| 7 | POST | /api/auth/refresh-token | No | Refresh token |
| 8 | GET | /api/users | Yes (admin) | List users |
| 9 | GET | /api/users/:id | Yes | Get user |
| 10 | PATCH | /api/users/:id | Yes | Update user |
| 11 | GET | /api/roles | Yes | List roles |
| 12 | POST | /api/roles/users/:userId/roles | Yes (admin) | Assign role |
| 13 | DELETE | /api/roles/users/:userId/roles/:roleId | Yes (admin) | Revoke role |
| 14 | POST | /api/products | Yes | Create product |
| 15 | GET | /api/products | Yes | List products |
| 16 | GET | /api/products/:id | Yes | Get product |
| 17 | PATCH | /api/products/:id | Yes | Update product |
| 18 | DELETE | /api/products/:id | Yes | Delete product |
| 19 | PATCH | /api/products/:id/status | Yes | Update product status |
| 20 | PATCH | /api/products/:id/stock | Yes | Update stock |
| 21 | POST | /api/products/bulk-delete | Yes | Bulk delete products |
| 22 | POST | /api/products/bulk-update-status | Yes | Bulk update status |
| 23 | POST | /api/products/:id/images | Yes | Upload product images |
| 24 | DELETE | /api/products/:id/images/:imageId | Yes | Delete product image |
| 25 | POST | /api/categories | Yes | Create category |
| 26 | GET | /api/categories | Yes | List categories |
| 27 | GET | /api/categories/:id | Yes | Get category |
| 28 | PATCH | /api/categories/:id | Yes | Update category |
| 29 | DELETE | /api/categories/:id | Yes | Delete category |
| 30 | GET | /api/analytics/overview | Yes | Analytics overview |
| 31 | GET | /api/analytics/products-by-category | Yes | Products by category |
| 32 | GET | /api/analytics/top-products | Yes | Top products |
| 33 | GET | /api/analytics/inventory-status | Yes | Inventory status |
| 34 | POST | /api/orders | Yes | Create order |
| 35 | GET | /api/orders | Yes | List orders |
| 36 | GET | /api/orders/:id | Yes | Get order |
| 37 | PATCH | /api/orders/:id/status | Yes | Update order status |
| 38 | POST | /api/organizations | Yes | Create organization |
| 39 | GET | /api/organizations | Yes | List organizations |
| 40 | GET | /api/organizations/:id | Yes | Get organization |
| 41 | POST | /api/organizations/:id/members | Yes | Add member |
| 42 | GET | /api/organizations/:id/members | Yes | List members |
| 43 | GET | /api/logs | Yes | List activity logs |
| 44 | GET | /api/notifications | Yes | List notifications |
| 45 | PATCH | /api/notifications/:id/read | Yes | Mark notification read |
| 46 | POST | /api/notifications/read-all | Yes | Mark all read |
| 47 | POST | /api/alert-rules | Yes | Create alert rule |
| 48 | GET | /api/alert-rules | Yes | List alert rules |
| 49 | GET | /api/alert-rules/:id | Yes | Get alert rule |
| 50 | PATCH | /api/alert-rules/:id | Yes | Update alert rule |
| 51 | DELETE | /api/alert-rules/:id | Yes | Delete alert rule |
| 52 | GET | /api/reports/sales | Yes | Sales report |
| 53 | GET | /api/reports/inventory | Yes | Inventory report |
| 54 | GET | /api/reports/export/products | Yes | Export products CSV |
| 55 | GET | /api/dashboard/summary | Yes | Dashboard summary |
| 56 | GET | /api/settings | Yes | Get setting |
| 57 | GET | /api/settings/list | Yes | List settings |
| 58 | PUT | /api/settings | Yes | Set setting |
| 59 | POST | /api/api-keys | Yes | Create API key |
| 60 | GET | /api/api-keys | Yes | List API keys |
| 61 | DELETE | /api/api-keys/:id | Yes | Revoke API key |
| 62 | POST | /api/webhooks | Yes | Create webhook |
| 63 | GET | /api/webhooks | Yes | List webhooks |
| 64 | GET | /api/webhooks/:id | Yes | Get webhook |
| 65 | PATCH | /api/webhooks/:id | Yes | Update webhook |
| 66 | DELETE | /api/webhooks/:id | Yes | Delete webhook |
| 67 | POST | /api/bulk/import/products | Yes | Bulk import products (CSV) |

---

## 1. Health & Ping (no auth)

```bash
# Health
curl -s http://localhost:3000/api/health

# Ping
curl -s http://localhost:3000/api/ping
```

---

## 2. Auth

```bash
# Signup
curl -s -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"test1234","name":"New User"}'

# Login (save token for below)
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"test"}'

# Logout (body: refreshToken from login response)
curl -s -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"refreshToken":"<REFRESH_TOKEN_FROM_LOGIN>"}'

# Me (current user)
curl -s http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Refresh token
curl -s -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<REFRESH_TOKEN>"}'
```

---

## 3. Users (admin/superadmin for list)

```bash
# List users (paginated)
curl -s "http://localhost:3000/api/users?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"

# Get user by ID
curl -s "http://localhost:3000/api/users/<USER_ID>" \
  -H "Authorization: Bearer $TOKEN"

# Update user
curl -s -X PATCH "http://localhost:3000/api/users/<USER_ID>" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Updated Name"}'
```

---

## 4. Roles

```bash
# List roles
curl -s http://localhost:3000/api/roles \
  -H "Authorization: Bearer $TOKEN"

# Assign role to user
curl -s -X POST "http://localhost:3000/api/roles/users/<USER_ID>/roles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"roleId":"<ROLE_ID>"}'

# Revoke role
curl -s -X DELETE "http://localhost:3000/api/roles/users/<USER_ID>/roles/<ROLE_ID>" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Products

```bash
# Create product
curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"New Product","description":"Description","categoryId":"<CATEGORY_ID>","status":"draft"}'

# List products (paginated, filterable)
curl -s "http://localhost:3000/api/products?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
curl -s "http://localhost:3000/api/products?search=wireless&categoryId=<CATEGORY_ID>" \
  -H "Authorization: Bearer $TOKEN"

# Get product by ID
curl -s "http://localhost:3000/api/products/<PRODUCT_ID>" \
  -H "Authorization: Bearer $TOKEN"

# Update product
curl -s -X PATCH "http://localhost:3000/api/products/<PRODUCT_ID>" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Updated Name","description":"Updated desc"}'

# Delete product
curl -s -X DELETE "http://localhost:3000/api/products/<PRODUCT_ID>" \
  -H "Authorization: Bearer $TOKEN"

# Update product status
curl -s -X PATCH "http://localhost:3000/api/products/<PRODUCT_ID>/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"active"}'
# status: draft | active | archived

# Update stock
curl -s -X PATCH "http://localhost:3000/api/products/<PRODUCT_ID>/stock" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"quantity":50,"lowStockThreshold":10}'

# Bulk delete
curl -s -X POST http://localhost:3000/api/products/bulk-delete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"ids":["<ID1>","<ID2>"]}'

# Bulk update status
curl -s -X POST http://localhost:3000/api/products/bulk-update-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"ids":["<ID1>","<ID2>"],"status":"active"}'

# Upload product images (multipart; field name: images or image)
curl -s -X POST "http://localhost:3000/api/products/<PRODUCT_ID>/images" \
  -H "Authorization: Bearer $TOKEN" \
  -F "images=@/path/to/image.jpg"

# Delete product image
curl -s -X DELETE "http://localhost:3000/api/products/<PRODUCT_ID>/images/<IMAGE_ID>" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6. Categories

```bash
# Create category
curl -s -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"New Category","description":"Description"}'

# List categories
curl -s http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN"

# Get category by ID
curl -s "http://localhost:3000/api/categories/<CATEGORY_ID>" \
  -H "Authorization: Bearer $TOKEN"

# Update category
curl -s -X PATCH "http://localhost:3000/api/categories/<CATEGORY_ID>" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Updated Name","description":"Updated desc"}'

# Delete category
curl -s -X DELETE "http://localhost:3000/api/categories/<CATEGORY_ID>" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 7. Analytics

```bash
# Overview (counts)
curl -s http://localhost:3000/api/analytics/overview \
  -H "Authorization: Bearer $TOKEN"

# Products by category
curl -s http://localhost:3000/api/analytics/products-by-category \
  -H "Authorization: Bearer $TOKEN"

# Top products
curl -s "http://localhost:3000/api/analytics/top-products?limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Inventory status
curl -s http://localhost:3000/api/analytics/inventory-status \
  -H "Authorization: Bearer $TOKEN"
```

---

## 8. Orders

```bash
# Create order
curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"items":[{"productId":"<PRODUCT_ID>","quantity":2,"unitPrice":19.99}]}'

# List orders (paginated, filterable)
curl -s "http://localhost:3000/api/orders?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
curl -s "http://localhost:3000/api/orders?status=pending" \
  -H "Authorization: Bearer $TOKEN"

# Get order by ID
curl -s "http://localhost:3000/api/orders/<ORDER_ID>" \
  -H "Authorization: Bearer $TOKEN"

# Update order status
curl -s -X PATCH "http://localhost:3000/api/orders/<ORDER_ID>/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"confirmed"}'
# status: pending | confirmed | shipped | delivered | cancelled
```

---

## 9. Organizations

```bash
# Create organization
curl -s -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Acme Corp"}'

# List my organizations
curl -s http://localhost:3000/api/organizations \
  -H "Authorization: Bearer $TOKEN"

# Get organization by ID
curl -s "http://localhost:3000/api/organizations/<ORG_ID>" \
  -H "Authorization: Bearer $TOKEN"

# Add member
curl -s -X POST "http://localhost:3000/api/organizations/<ORG_ID>/members" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"userId":"<USER_ID>","role":"member"}'

# List members
curl -s "http://localhost:3000/api/organizations/<ORG_ID>/members" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 10. Activity Logs

```bash
# List logs (paginated, filterable)
curl -s "http://localhost:3000/api/logs?page=1&limit=50" \
  -H "Authorization: Bearer $TOKEN"
curl -s "http://localhost:3000/api/logs?entity=product&action=update" \
  -H "Authorization: Bearer $TOKEN"
curl -s "http://localhost:3000/api/logs?dateFrom=2025-01-01&dateTo=2025-12-31" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 11. Notifications

```bash
# List notifications
curl -s "http://localhost:3000/api/notifications?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
curl -s "http://localhost:3000/api/notifications?unreadOnly=true" \
  -H "Authorization: Bearer $TOKEN"

# Mark one as read
curl -s -X PATCH "http://localhost:3000/api/notifications/<NOTIFICATION_ID>/read" \
  -H "Authorization: Bearer $TOKEN"

# Mark all as read
curl -s -X POST http://localhost:3000/api/notifications/read-all \
  -H "Authorization: Bearer $TOKEN"
```

---

## 12. Alert Rules

```bash
# Create
curl -s -X POST http://localhost:3000/api/alert-rules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Low stock","conditionType":"low_stock","conditionConfig":{"threshold":5},"isActive":true}'

# List
curl -s "http://localhost:3000/api/alert-rules" \
  -H "Authorization: Bearer $TOKEN"
curl -s "http://localhost:3000/api/alert-rules?isActive=true" \
  -H "Authorization: Bearer $TOKEN"

# Get by ID
curl -s "http://localhost:3000/api/alert-rules/<ID>" \
  -H "Authorization: Bearer $TOKEN"

# Update
curl -s -X PATCH "http://localhost:3000/api/alert-rules/<ID>" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"isActive":false}'

# Delete
curl -s -X DELETE "http://localhost:3000/api/alert-rules/<ID>" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 13. Reports

```bash
# Sales report
curl -s "http://localhost:3000/api/reports/sales" \
  -H "Authorization: Bearer $TOKEN"
curl -s "http://localhost:3000/api/reports/sales?dateFrom=2025-01-01&dateTo=2025-12-31" \
  -H "Authorization: Bearer $TOKEN"

# Inventory report
curl -s http://localhost:3000/api/reports/inventory \
  -H "Authorization: Bearer $TOKEN"

# Export products CSV
curl -s "http://localhost:3000/api/reports/export/products" \
  -H "Authorization: Bearer $TOKEN" \
  -o products.csv
```

---

## 14. Dashboard

```bash
# Summary
curl -s http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer $TOKEN"
```

---

## 15. Settings

```bash
# Get one setting
curl -s "http://localhost:3000/api/settings?scope=global&key=theme" \
  -H "Authorization: Bearer $TOKEN"

# List settings by scope
curl -s "http://localhost:3000/api/settings/list?scope=global" \
  -H "Authorization: Bearer $TOKEN"

# Set setting
curl -s -X PUT http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"scope":"global","key":"theme","value":"dark"}'
```

---

## 16. API Keys

```bash
# Create (raw key returned once only)
curl -s -X POST http://localhost:3000/api/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"My integration"}'

# List
curl -s http://localhost:3000/api/api-keys \
  -H "Authorization: Bearer $TOKEN"

# Revoke
curl -s -X DELETE "http://localhost:3000/api/api-keys/<KEY_ID>" \
  -H "Authorization: Bearer $TOKEN"

# Use API key instead of Bearer
curl -s "http://localhost:3000/api/products" \
  -H "X-API-Key: <YOUR_RAW_KEY>"
```

---

## 17. Webhooks

```bash
# Create
curl -s -X POST http://localhost:3000/api/webhooks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"url":"https://your-server.com/webhook","events":["order.created","product.created"]}'

# List
curl -s http://localhost:3000/api/webhooks \
  -H "Authorization: Bearer $TOKEN"

# Get by ID
curl -s "http://localhost:3000/api/webhooks/<ID>" \
  -H "Authorization: Bearer $TOKEN"

# Update
curl -s -X PATCH "http://localhost:3000/api/webhooks/<ID>" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"isActive":false}'

# Delete
curl -s -X DELETE "http://localhost:3000/api/webhooks/<ID>" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 18. Bulk Import

**CSV format:** header row with columns `name`, `categoryId` (required). Optional: `price`, `stock`, `description`, `status`, `imageUrl`, `imageUrls`.

- **categoryId** can be a category ID (from `GET /api/categories`) or a **slug** (e.g. `cat_electronics`, `electronics`, `cat_laptops`, `cat_audio`). Slugs are normalized (`cat_xyz` → `xyz`).
- **price** (number) is stored on the product.
- **stock** (integer) creates/updates inventory quantity for the product.
- **imageUrl** (optional) – single image URL (must start with `http://` or `https://`). Creates one product image.
- **imageUrls** (optional) – multiple image URLs separated by `|` or `;`. Creates one product image per URL.  
  (CSV cannot upload binary files; use URLs only. For file uploads use `POST /api/products/:id/images`.)

**Example CSV (correct):**
```csv
name,categoryId,price,stock
iPhone 15 Pro,cat_electronics,999,50
Samsung Galaxy S24,cat_electronics,899,40
MacBook Air M2,cat_laptops,1199,20
Sony WH-1000XM5,cat_audio,349,30
Nike Air Max,cat_fashion,149,70
```

**Categories that resolve by slug (after seed):** electronics, audio, laptops, monitors, accessories, cameras, wearables, smart-home, tv, fashion, home, appliances, grocery, books, gaming, sports. Use `cat_electronics`, `cat_laptops`, etc., or the exact slug.

```bash
# Import products from CSV (JSON body with csv string)
curl -s -X POST http://localhost:3000/api/bulk/import/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"csv":"name,categoryId,price,stock\niPhone 15 Pro,cat_electronics,999,50\nSamsung Galaxy S24,cat_electronics,899,40"}'
```

---

## Seed data (for testing)

After `npm run db:seed` you have:

- **Users:** 100 (login: `admin@company.com` / `test`; also `user10@seed.com` … `user100@seed.com` with password `test`)
- **Roles:** 6 (superadmin, admin, manager, editor, viewer, support)
- **User roles:** 100+ assignments
- **Sessions:** 100
- **Categories:** 100
- **Products:** 120 (with images, inventory)
- **Product images:** 120+
- **Inventory:** 120
- **Orders:** 100 (with items and status history)
- **Order items:** 200+
- **Order status history:** 200+
- **Product status history:** 100
- **Activity logs:** 100
- **Notifications:** 100
- **Analytics events:** 100

Replace `<PRODUCT_ID>`, `<CATEGORY_ID>`, `<USER_ID>`, `<ORDER_ID>`, `<ORG_ID>`, `<ROLE_ID>`, `<NOTIFICATION_ID>`, `<IMAGE_ID>`, `<ID>` in the curls with real IDs from list responses.
