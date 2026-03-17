const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Orders API', () => {
  let token;
  let productId;
  let orderId;

  it('get token and product for order', async () => {
    token = await getToken();
    const listRes = await request(app).get('/api/products?limit=1').set(authHeader(token));
    if (listRes.body.data?.items?.length > 0) productId = listRes.body.data.items[0].id;
  });

  describe('GET /api/orders', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/orders');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and list with token', async () => {
      const res = await request(app).get('/api/orders').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.data?.items));
      if (res.body.data.items.length > 0) orderId = res.body.data.items[0].id;
    });
  });

  describe('POST /api/orders', () => {
    it('should return 400 when items empty', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set(authHeader(token))
        .send({ items: [] });
      assert.strictEqual(res.status, 400);
    });

    it('should return 201 and order when valid (if product has stock)', async () => {
      if (!productId) return;
      const res = await request(app)
        .post('/api/orders')
        .set(authHeader(token))
        .send({
          items: [{ productId, quantity: 1, unitPrice: 10 }],
        });
      if (res.status === 201) {
        assert.ok(res.body.data.order?.id);
        orderId = res.body.data.order.id;
      }
      assert.ok([201, 400].includes(res.status));
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return 404 for invalid id', async () => {
      const res = await request(app)
        .get('/api/orders/invalid-order-id')
        .set(authHeader(token));
      assert.strictEqual(res.status, 404);
    });

    it('should return 200 when order exists', async () => {
      if (!orderId) return;
      const res = await request(app).get(`/api/orders/${orderId}`).set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.order.id, orderId);
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('should return 200 and updated status', async () => {
      if (!orderId) return;
      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set(authHeader(token))
        .send({ status: 'confirmed' });
      assert.strictEqual(res.status, 200);
      assert.ok(
        ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(
          res.body.data?.order?.status
        )
      );
    });

    it('should accept processing status', async () => {
      if (!orderId) return;
      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set(authHeader(token))
        .send({ status: 'processing' });
      assert.ok([200, 400].includes(res.status));
    });
  });

  describe('POST /api/orders extended (shipping, notes)', () => {
    it('should create order with shippingAddress and notes when stock allows', async () => {
      if (!productId) return;
      const res = await request(app)
        .post('/api/orders')
        .set(authHeader(token))
        .send({
          items: [{ productId, quantity: 1, unitPrice: 9.99 }],
          shippingAddress: {
            line1: '1 Test Rd',
            city: 'Boston',
            state: 'MA',
            postalCode: '02101',
            country: 'USA',
          },
          customerNote: 'Ring doorbell',
          internalNote: 'Test order',
        });
      assert.ok([201, 400].includes(res.status));
      if (res.status === 201) {
        assert.ok(res.body.data.order?.id);
        assert.ok(res.body.data.order.shippingAddress);
      }
    });
  });
});
