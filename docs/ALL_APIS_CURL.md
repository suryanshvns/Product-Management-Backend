# All APIs – cURL Reference

Base URL: `http://localhost:3000/api`

**Get token (use in all authenticated requests):**
```bash
export TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"test"}' | jq -r '.data.accessToken')
```

Use: `-H "Authorization: Bearer $TOKEN"` or API key: `-H "X-API-Key: YOUR_API_KEY"`

---

## Auth (existing)
```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" -d '{"email":"new@co.com","password":"test1234","name":"New User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" -d '{"email":"admin@company.com","password":"test"}'

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"refreshToken":"<refresh_token_from_login>"}'

# Me
curl -X GET http://localhost:3000/api/auth/me -H "Authorization: Bearer $TOKEN"

# Refresh token
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" -d '{"refreshToken":"<refresh_token>"}'
```

---

## Orders
```bash
# Create order (reduce inventory)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"items":[{"productId":"<PRODUCT_ID>","quantity":2,"unitPrice":19.99}]}'

# List orders
curl -X GET "http://localhost:3000/api/orders" -H "Authorization: Bearer $TOKEN"
curl -X GET "http://localhost:3000/api/orders?page=1&limit=10&status=pending" -H "Authorization: Bearer $TOKEN"

# Get order by ID
curl -X GET "http://localhost:3000/api/orders/<ORDER_ID>" -H "Authorization: Bearer $TOKEN"

# Update order status
curl -X PATCH "http://localhost:3000/api/orders/<ORDER_ID>/status" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"confirmed"}'
# status: pending | confirmed | shipped | delivered | cancelled
```

---

## Organizations
```bash
# Create organization (you become admin)
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Acme Corp"}'

# List my organizations
curl -X GET http://localhost:3000/api/organizations -H "Authorization: Bearer $TOKEN"

# Get organization by ID
curl -X GET "http://localhost:3000/api/organizations/<ORG_ID>" -H "Authorization: Bearer $TOKEN"

# Add member
curl -X POST "http://localhost:3000/api/organizations/<ORG_ID>/members" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"userId":"<USER_ID>","role":"member"}'

# List members
curl -X GET "http://localhost:3000/api/organizations/<ORG_ID>/members" -H "Authorization: Bearer $TOKEN"
```

---

## Activity Logs
```bash
# List logs (paginated, filterable)
curl -X GET "http://localhost:3000/api/logs" -H "Authorization: Bearer $TOKEN"
curl -X GET "http://localhost:3000/api/logs?entity=product&action=create&page=1&limit=20" -H "Authorization: Bearer $TOKEN"
curl -X GET "http://localhost:3000/api/logs?dateFrom=2025-01-01&dateTo=2025-12-31" -H "Authorization: Bearer $TOKEN"
```

---

## Notifications
```bash
# List notifications (includes unreadCount)
curl -X GET "http://localhost:3000/api/notifications" -H "Authorization: Bearer $TOKEN"
curl -X GET "http://localhost:3000/api/notifications?unreadOnly=true" -H "Authorization: Bearer $TOKEN"

# Mark one as read
curl -X PATCH "http://localhost:3000/api/notifications/<NOTIFICATION_ID>/read" \
  -H "Authorization: Bearer $TOKEN"

# Mark all as read
curl -X POST "http://localhost:3000/api/notifications/read-all" -H "Authorization: Bearer $TOKEN"
```

---

## Alert Rules
```bash
# Create
curl -X POST http://localhost:3000/api/alert-rules \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Low stock","conditionType":"low_stock","conditionConfig":{"threshold":5},"isActive":true}'

# List
curl -X GET "http://localhost:3000/api/alert-rules" -H "Authorization: Bearer $TOKEN"
curl -X GET "http://localhost:3000/api/alert-rules?isActive=true" -H "Authorization: Bearer $TOKEN"

# Get by ID
curl -X GET "http://localhost:3000/api/alert-rules/<ID>" -H "Authorization: Bearer $TOKEN"

# Update
curl -X PATCH "http://localhost:3000/api/alert-rules/<ID>" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"isActive":false}'

# Delete
curl -X DELETE "http://localhost:3000/api/alert-rules/<ID>" -H "Authorization: Bearer $TOKEN"
```

---

## Reports
```bash
# Sales report
curl -X GET "http://localhost:3000/api/reports/sales" -H "Authorization: Bearer $TOKEN"
curl -X GET "http://localhost:3000/api/reports/sales?dateFrom=2025-01-01&dateTo=2025-12-31" -H "Authorization: Bearer $TOKEN"

# Inventory report (low stock, out of stock)
curl -X GET "http://localhost:3000/api/reports/inventory" -H "Authorization: Bearer $TOKEN"

# Export products CSV
curl -X GET "http://localhost:3000/api/reports/export/products" -H "Authorization: Bearer $TOKEN" -o products.csv
```

---

## Dashboard
```bash
# Summary (counts + recent orders + recent activity)
curl -X GET "http://localhost:3000/api/dashboard/summary" -H "Authorization: Bearer $TOKEN"
```

---

## Settings
```bash
# Get one setting
curl -X GET "http://localhost:3000/api/settings?scope=global&key=theme" -H "Authorization: Bearer $TOKEN"

# List settings (by scope)
curl -X GET "http://localhost:3000/api/settings/list?scope=global" -H "Authorization: Bearer $TOKEN"

# Set setting
curl -X PUT http://localhost:3000/api/settings \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"scope":"global","key":"theme","value":"dark"}'
curl -X PUT http://localhost:3000/api/settings \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"scope":"organization","scopeId":"<ORG_ID>","organizationId":"<ORG_ID>","key":"currency","value":"USD"}'
```

---

## API Keys
```bash
# Create (returns raw key once; store it)
curl -X POST http://localhost:3000/api/api-keys \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"My integration"}'

# List (no raw keys)
curl -X GET "http://localhost:3000/api/api-keys" -H "Authorization: Bearer $TOKEN"

# Revoke
curl -X DELETE "http://localhost:3000/api/api-keys/<KEY_ID>" -H "Authorization: Bearer $TOKEN"

# Use API key instead of Bearer
curl -X GET "http://localhost:3000/api/products" -H "X-API-Key: pm_xxxxxxxx"
```

---

## Webhooks
```bash
# Create
curl -X POST http://localhost:3000/api/webhooks \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"url":"https://your-server.com/webhook","events":["order.created","product.created"]}'

# List
curl -X GET "http://localhost:3000/api/webhooks" -H "Authorization: Bearer $TOKEN"

# Get by ID
curl -X GET "http://localhost:3000/api/webhooks/<ID>" -H "Authorization: Bearer $TOKEN"

# Update
curl -X PATCH "http://localhost:3000/api/webhooks/<ID>" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"isActive":false}'

# Delete
curl -X DELETE "http://localhost:3000/api/webhooks/<ID>" -H "Authorization: Bearer $TOKEN"
```

---

## Bulk Import
```bash
# Import products from CSV (body: raw CSV or JSON { "csv": "..." })
# CSV columns: name, categoryId (or category_id)
curl -X POST "http://localhost:3000/api/bulk/import/products" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"csv":"name,categoryId\nWidget A,<CATEGORY_ID>\nWidget B,<CATEGORY_ID>"}'
```

---

## Products, Categories, Analytics (existing)

See `docs/PRODUCTS_API_CURL.md` and `docs/CATEGORIES_AND_ANALYTICS_CURL.md` for full product, category, and analytics cURL examples.

**Quick reference:**
- **Products:** POST/GET/PATCH/DELETE `/api/products`, PATCH `/api/products/:id/status`, PATCH `/api/products/:id/stock`, POST `/api/products/bulk-delete`, POST `/api/products/bulk-update-status`
- **Categories:** POST/GET/PATCH/DELETE `/api/categories`
- **Analytics:** GET `/api/analytics/overview`, `/api/analytics/products-by-category`, `/api/analytics/top-products`, `/api/analytics/inventory-status`
