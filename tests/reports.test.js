const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Reports API', () => {
  let token;

  it('get token', async () => {
    token = await getToken();
  });

  describe('GET /api/reports/sales', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/reports/sales');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and sales data', async () => {
      const res = await request(app).get('/api/reports/sales').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(typeof res.body.data.totalRevenue === 'number');
      assert.ok(Array.isArray(res.body.data.byCategory));
      assert.ok(Array.isArray(res.body.data.byProduct));
    });
  });

  describe('GET /api/reports/inventory', () => {
    it('should return 200 and inventory report', async () => {
      const res = await request(app).get('/api/reports/inventory').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(typeof res.body.data.totalSkus === 'number');
      assert.ok(Array.isArray(res.body.data.lowStockItems));
    });
  });

  describe('GET /api/reports/export/products', () => {
    it('should return 200 and CSV content', async () => {
      const res = await request(app)
        .get('/api/reports/export/products')
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(res.text.includes('id') || res.text.includes('name'));
    });
  });
});
