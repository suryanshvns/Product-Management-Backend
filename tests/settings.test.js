const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Settings API', () => {
  let token;

  it('get token', async () => {
    token = await getToken();
  });

  describe('PUT /api/settings', () => {
    it('should return 200 and set global setting', async () => {
      const res = await request(app)
        .put('/api/settings')
        .set(authHeader(token))
        .send({ scope: 'global', key: 'test_key', value: 'test_value' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
    });
  });

  describe('GET /api/settings', () => {
    it('should return 200 and value', async () => {
      const res = await request(app)
        .get('/api/settings?scope=global&key=test_key')
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.value, 'test_value');
    });
  });

  describe('GET /api/settings/list', () => {
    it('should return 200 and settings object', async () => {
      const res = await request(app)
        .get('/api/settings/list?scope=global')
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.data.settings && typeof res.body.data.settings === 'object');
    });
  });
});
