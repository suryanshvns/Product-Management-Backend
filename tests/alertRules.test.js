const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Alert Rules API', () => {
  let token;
  let ruleId;

  it('get token', async () => {
    token = await getToken();
  });

  describe('GET /api/alert-rules', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/alert-rules');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and list', async () => {
      const res = await request(app).get('/api/alert-rules').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.alertRules));
      if (res.body.data.alertRules.length > 0) ruleId = res.body.data.alertRules[0].id;
    });
  });

  describe('POST /api/alert-rules', () => {
    it('should return 201 and alert rule', async () => {
      const res = await request(app)
        .post('/api/alert-rules')
        .set(authHeader(token))
        .send({
          name: 'Low stock alert',
          conditionType: 'low_stock',
          conditionConfig: { threshold: 5 },
          isActive: true,
        });
      assert.strictEqual(res.status, 201);
      assert.ok(res.body.data.alertRule?.id);
      if (!ruleId) ruleId = res.body.data.alertRule.id;
    });
  });

  describe('GET /api/alert-rules/:id', () => {
    it('should return 200 when found', async () => {
      if (!ruleId) return;
      const res = await request(app).get(`/api/alert-rules/${ruleId}`).set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.alertRule.id, ruleId);
    });

    it('should return 404 for invalid id', async () => {
      const res = await request(app)
        .get('/api/alert-rules/invalid-id')
        .set(authHeader(token));
      assert.strictEqual(res.status, 404);
    });
  });

  describe('PATCH /api/alert-rules/:id', () => {
    it('should return 200 and updated rule', async () => {
      if (!ruleId) return;
      const res = await request(app)
        .patch(`/api/alert-rules/${ruleId}`)
        .set(authHeader(token))
        .send({ isActive: false });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.alertRule.isActive, false);
    });
  });

  describe('DELETE /api/alert-rules/:id', () => {
    it('should return 200', async () => {
      if (!ruleId) return;
      const res = await request(app)
        .delete(`/api/alert-rules/${ruleId}`)
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
    });
  });
});
