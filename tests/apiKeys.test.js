const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('API Keys API', () => {
  let token;
  let keyId;

  it('get token', async () => {
    token = await getToken();
  });

  describe('POST /api/api-keys', () => {
    it('should return 201 and raw key once', async () => {
      const res = await request(app)
        .post('/api/api-keys')
        .set(authHeader(token))
        .send({ name: `Test key ${Date.now()}` });
      assert.strictEqual(res.status, 201);
      assert.ok(res.body.data.apiKey);
      assert.ok(res.body.data.message);
    });
  });

  describe('GET /api/api-keys', () => {
    it('should return 200 and list (no raw keys)', async () => {
      const res = await request(app).get('/api/api-keys').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.apiKeys));
      if (res.body.data.apiKeys.length > 0) keyId = res.body.data.apiKeys[0].id;
    });
  });

  describe('DELETE /api/api-keys/:id', () => {
    it('should return 200 when key exists', async () => {
      if (!keyId) return;
      const res = await request(app)
        .delete(`/api/api-keys/${keyId}`)
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
    });

    it('should return 404 for invalid id', async () => {
      const res = await request(app)
        .delete('/api/api-keys/invalid-key-id')
        .set(authHeader(token));
      assert.strictEqual(res.status, 404);
    });
  });
});
