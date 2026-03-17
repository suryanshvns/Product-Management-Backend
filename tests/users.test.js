const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Users API', () => {
  let token;

  it('get token', async () => {
    token = await getToken();
  });

  describe('GET /api/users', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/users');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and list with token', async () => {
      const res = await request(app).get('/api/users').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.users ?? res.body.data?.items));
    });
  });
});
