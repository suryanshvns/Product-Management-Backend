const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Dashboard API', () => {
  let token;

  it('get token', async () => {
    token = await getToken();
  });

  describe('GET /api/dashboard/summary', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/dashboard/summary');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and summary', async () => {
      const res = await request(app)
        .get('/api/dashboard/summary')
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(typeof res.body.data.productCount === 'number');
      assert.ok(typeof res.body.data.orderCount === 'number');
      assert.ok(Array.isArray(res.body.data.recentOrders));
      assert.ok(Array.isArray(res.body.data.recentActivity));
    });
  });
});
