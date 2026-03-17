const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Organizations API', () => {
  let token;
  let orgId;

  it('get token', async () => {
    token = await getToken();
  });

  describe('GET /api/organizations', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/organizations');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and list', async () => {
      const res = await request(app).get('/api/organizations').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.organizations));
      if (res.body.data.organizations.length > 0) orgId = res.body.data.organizations[0].id;
    });
  });

  describe('POST /api/organizations', () => {
    it('should return 201 and organization', async () => {
      const res = await request(app)
        .post('/api/organizations')
        .set(authHeader(token))
        .send({ name: `Test Org ${Date.now()}` });
      assert.strictEqual(res.status, 201);
      assert.ok(res.body.data.organization?.id);
      if (!orgId) orgId = res.body.data.organization.id;
    });
  });

  describe('GET /api/organizations/:id', () => {
    it('should return 200 when found', async () => {
      if (!orgId) return;
      const res = await request(app).get(`/api/organizations/${orgId}`).set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.organization.id, orgId);
    });

    it('should return 404 for invalid id', async () => {
      const res = await request(app)
        .get('/api/organizations/invalid-org-id')
        .set(authHeader(token));
      assert.strictEqual(res.status, 404);
    });
  });

  describe('GET /api/organizations/:id/members', () => {
    it('should return 200 and members list', async () => {
      if (!orgId) return;
      const res = await request(app)
        .get(`/api/organizations/${orgId}/members`)
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.members));
    });
  });
});
