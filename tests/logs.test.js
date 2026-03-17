const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Logs API', () => {
  let token;

  it('get token', async () => {
    token = await getToken();
  });

  describe('GET /api/logs', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/logs');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and paginated list', async () => {
      const res = await request(app).get('/api/logs').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.data?.items));
      assert.ok(typeof res.body.data?.total === 'number');
    });

    it('should accept query params', async () => {
      const res = await request(app)
        .get('/api/logs?page=1&limit=5')
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.data.items.length <= 5);
    });
  });
});
