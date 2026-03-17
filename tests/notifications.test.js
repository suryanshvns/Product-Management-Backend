const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Notifications API', () => {
  let token;

  it('get token', async () => {
    token = await getToken();
  });

  describe('GET /api/notifications', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/notifications');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and list with unreadCount', async () => {
      const res = await request(app).get('/api/notifications').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.data?.items));
      assert.ok(typeof res.body.data?.unreadCount === 'number');
    });
  });

  describe('POST /api/notifications/read-all', () => {
    it('should return 200', async () => {
      const res = await request(app)
        .post('/api/notifications/read-all')
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
    });
  });
});
