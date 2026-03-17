const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Webhooks API', () => {
  let token;
  let webhookId;

  it('get token', async () => {
    token = await getToken();
  });

  describe('POST /api/webhooks', () => {
    it('should return 400 when url invalid', async () => {
      const res = await request(app)
        .post('/api/webhooks')
        .set(authHeader(token))
        .send({ url: 'not-a-url', events: ['order.created'] });
      assert.strictEqual(res.status, 400);
    });

    it('should return 201 and webhook', async () => {
      const res = await request(app)
        .post('/api/webhooks')
        .set(authHeader(token))
        .send({
          url: 'https://webhook.site/test',
          events: ['order.created', 'product.created'],
        });
      assert.strictEqual(res.status, 201);
      assert.ok(res.body.data.webhook?.id);
      webhookId = res.body.data.webhook.id;
    });
  });

  describe('GET /api/webhooks', () => {
    it('should return 200 and list', async () => {
      const res = await request(app).get('/api/webhooks').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.webhooks));
      if (!webhookId && res.body.data.webhooks.length > 0) webhookId = res.body.data.webhooks[0].id;
    });
  });

  describe('GET /api/webhooks/:id', () => {
    it('should return 200 when found', async () => {
      if (!webhookId) return;
      const res = await request(app).get(`/api/webhooks/${webhookId}`).set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.webhook.id, webhookId);
    });
  });

  describe('PATCH /api/webhooks/:id', () => {
    it('should return 200 and updated webhook', async () => {
      if (!webhookId) return;
      const res = await request(app)
        .patch(`/api/webhooks/${webhookId}`)
        .set(authHeader(token))
        .send({ isActive: false });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.webhook.isActive, false);
    });
  });

  describe('DELETE /api/webhooks/:id', () => {
    it('should return 200', async () => {
      if (!webhookId) return;
      const res = await request(app)
        .delete(`/api/webhooks/${webhookId}`)
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
    });
  });
});
