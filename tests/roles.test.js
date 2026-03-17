const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Roles API', () => {
  let token;

  it('get token', async () => {
    token = await getToken();
  });

  describe('GET /api/roles', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/roles');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and list with token', async () => {
      const res = await request(app).get('/api/roles').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.roles ?? res.body.data));
    });
  });
});
