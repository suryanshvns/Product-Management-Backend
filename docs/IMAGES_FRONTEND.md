# Product Images – Frontend Guide

## 1. Getting image data from the API

Product list and product detail responses now include an **`images`** array (sorted by `sortOrder`):

```json
{
  "success": true,
  "data": {
    "product": {
      "id": "...",
      "name": "Widget",
      "images": [
        {
          "id": "clxx...",
          "productId": "...",
          "url": "/uploads/products/abc-123.jpg",
          "alt": "Widget main view",
          "sortOrder": 0
        }
      ]
    }
  }
}
```

- **GET /api/products** – each item in `data.items` has `images[]`.
- **GET /api/products/:id** – `data.product` has `images[]`.

## 2. Displaying images in the frontend

Image `url` is a **path** (e.g. `/uploads/products/xyz.jpg`). Use your **API base URL** as origin so the browser can load the image.

**Option A – Same origin (frontend and API on same host)**  
If the frontend is served from the same server (e.g. both on `localhost:3000`), you can use the path as-is:

```jsx
<img src={image.url} alt={image.alt || product.name} />
```

**Option B – Different origin (recommended)**  
If the frontend runs on a different port or domain (e.g. React on `http://localhost:3001`, API on `http://localhost:3000`), prepend the API origin:

```jsx
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Single image
<img
  src={`${API_BASE}${image.url}`}
  alt={image.alt || product.name}
/>

// All product images
{product.images?.map((img) => (
  <img
    key={img.id}
    src={`${API_BASE}${img.url}`}
    alt={img.alt || product.name}
  />
))}
```

**Placeholder when there are no images:**

```jsx
{product.images?.length > 0 ? (
  <img src={`${API_BASE}${product.images[0].url}`} alt={product.name} />
) : (
  <div className="placeholder">No image</div>
)}
```

## 3. Uploading images (from the frontend)

**Endpoint:** `POST /api/products/:id/images`  
**Auth:** `Authorization: Bearer <token>`  
**Body:** `multipart/form-data` with field name **`images`** (multiple files allowed, max 5 per request).

**Using fetch:**

```js
const formData = new FormData();
formData.append('images', file1); // File from <input type="file" multiple />
formData.append('images', file2);
formData.append('alt', 'Optional alt text'); // optional

const res = await fetch(`${API_BASE}/api/products/${productId}/images`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    // Do NOT set Content-Type; browser sets it with boundary for FormData
  },
  body: formData,
});
const data = await res.json();
// data.data.product.images includes the new images
```

**Using axios:**

```js
await axios.post(
  `${API_BASE}/api/products/${productId}/images`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }
);
```

**Allowed types:** JPEG, PNG, GIF, WebP. **Max file size:** 5MB (configurable via `UPLOAD_MAX_FILE_SIZE`).

## 4. Deleting an image

**Endpoint:** `DELETE /api/products/:productId/images/:imageId`  
**Auth:** `Authorization: Bearer <token>`

```js
await fetch(`${API_BASE}/api/products/${productId}/images/${imageId}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` },
});
```

## 5. cURL examples

**Upload (from terminal):**
```bash
curl -X POST "http://localhost:3000/api/products/<PRODUCT_ID>/images" \
  -H "Authorization: Bearer $TOKEN" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.png" \
  -F "alt=Product photo"
```

**Delete:**
```bash
curl -X DELETE "http://localhost:3000/api/products/<PRODUCT_ID>/images/<IMAGE_ID>" \
  -H "Authorization: Bearer $TOKEN"
```

## 6. CORS

The app allows `http://localhost:3001` by default. For other frontend origins, update the `cors` config in `src/app.js`. Static image URLs under `/uploads` are served with `Cross-Origin-Resource-Policy: cross-origin` so they can be used in `<img>` from other origins.
