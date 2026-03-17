const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Products API', () => {
  let token;
  let categoryId;
  let productId;

  it('get token and category for product tests', async () => {
    token = await getToken();
    const catRes = await request(app).get('/api/categories').set(authHeader(token));
    assert.strictEqual(catRes.status, 200);
    assert.ok(Array.isArray(catRes.body.data?.categories));
    if (catRes.body.data.categories.length > 0) {
      categoryId = catRes.body.data.categories[0].id;
    }
  });

  describe('GET /api/products', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/products');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and list with token', async () => {
      token = token || (await getToken());
      const res = await request(app).get('/api/products').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.data?.items));
      assert.ok(typeof res.body.data?.total === 'number');
      if (res.body.data.items.length > 0) productId = res.body.data.items[0].id;
    });

    it('should accept query params page and limit', async () => {
      token = token || (await getToken());
      const res = await request(app)
        .get('/api/products?page=1&limit=5')
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.data.items.length <= 5);
    });
  });

  describe('POST /api/products', () => {
    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Test', categoryId: 'x' });
      assert.strictEqual(res.status, 401);
    });

    it('should return 400 when body invalid', async () => {
      token = token || (await getToken());
      const res = await request(app).post('/api/products').set(authHeader(token)).send({});
      assert.strictEqual(res.status, 400);
    });

    it('should return 201 and product when valid (if category exists)', async () => {
      if (!categoryId) return;
      token = token || (await getToken());
      const res = await request(app)
        .post('/api/products')
        .set(authHeader(token))
        .send({ name: `Test Product ${Date.now()}`, categoryId, status: 'draft' });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.product?.id);
      assert.ok(Array.isArray(res.body.data.product?.images));
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return 401 without token', async () => {
      if (!productId) return;
      const res = await request(app).get(`/api/products/${productId}`);
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and product when found', async () => {
      if (!productId) return;
      token = token || (await getToken());
      const res = await request(app).get(`/api/products/${productId}`).set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.product.id, productId);
      assert.ok(Array.isArray(res.body.data.product.images));
    });

    it('should return 404 for invalid id', async () => {
      token = token || (await getToken());
      const res = await request(app)
        .get('/api/products/invalid-id-12345')
        .set(authHeader(token));
      assert.strictEqual(res.status, 404);
    });
  });

  describe('PATCH /api/products/:id', () => {
    it('should return 200 and updated product', async () => {
      if (!productId) return;
      token = token || (await getToken());
      const res = await request(app)
        .patch(`/api/products/${productId}`)
        .set(authHeader(token))
        .send({ name: 'Updated Name' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.product.name, 'Updated Name');
    });
  });

  describe('PATCH /api/products/:id/status', () => {
    it('should return 200 and product with new status', async () => {
      if (!productId) return;
      token = token || (await getToken());
      const res = await request(app)
        .patch(`/api/products/${productId}/status`)
        .set(authHeader(token))
        .send({ status: 'active' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.product.status, 'active');
    });
  });

  describe('PATCH /api/products/:id/stock', () => {
    it('should return 200 and product with inventory', async () => {
      if (!productId) return;
      token = token || (await getToken());
      const res = await request(app)
        .patch(`/api/products/${productId}/stock`)
        .set(authHeader(token))
        .send({ quantity: 100 });
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.data.product.inventory);
      assert.strictEqual(res.body.data.product.inventory.quantity, 100);
    });
  });

  describe('POST /api/products/bulk-update-status', () => {
    it('should return 200 and updated count', async () => {
      if (!productId) return;
      token = token || (await getToken());
      const res = await request(app)
        .post('/api/products/bulk-update-status')
        .set(authHeader(token))
        .send({ ids: [productId], status: 'draft' });
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.data.updatedCount >= 0);
    });
  });

  describe('DELETE /api/products/:id/images/:imageId', () => {
    it('should return 404 when image does not exist', async () => {
      if (!productId) return;
      token = token || (await getToken());
      const res = await request(app)
        .delete(`/api/products/${productId}/images/nonexistent-image-id`)
        .set(authHeader(token));
      assert.strictEqual(res.status, 404);
    });
  });
});
