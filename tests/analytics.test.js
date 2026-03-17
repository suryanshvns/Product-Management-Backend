const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Analytics API', () => {
  let token;

  it('get token', async () => {
    token = await getToken();
  });

  describe('GET /api/analytics/overview', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/analytics/overview');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and counts', async () => {
      const res = await request(app).get('/api/analytics/overview').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(typeof res.body.data.productCount === 'number');
      assert.ok(typeof res.body.data.categoryCount === 'number');
      assert.ok(typeof res.body.data.lowStockCount === 'number');
    });
  });

  describe('GET /api/analytics/products-by-category', () => {
    it('should return 200 and categories with products', async () => {
      const res = await request(app)
        .get('/api/analytics/products-by-category')
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.categories));
    });
  });

  describe('GET /api/analytics/top-products', () => {
    it('should return 200 and products', async () => {
      const res = await request(app).get('/api/analytics/top-products').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.products));
    });

    it('should accept limit query', async () => {
      const res = await request(app)
        .get('/api/analytics/top-products?limit=3')
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.data.products.length <= 3);
    });
  });

  describe('GET /api/analytics/inventory-status', () => {
    it('should return 200 and inventory summary', async () => {
      const res = await request(app)
        .get('/api/analytics/inventory-status')
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(typeof res.body.data.total === 'number');
      assert.ok(Array.isArray(res.body.data.lowStockItems));
    });
  });
});
