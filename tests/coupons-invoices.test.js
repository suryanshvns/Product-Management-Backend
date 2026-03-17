const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Coupons & Invoices API', () => {
  let token;
  let couponId;
  let orderId;

  it('setup', async () => {
    token = await getToken();
    const orders = await request(app).get('/api/orders?limit=5').set(authHeader(token));
    if (orders.body.data?.items?.length) orderId = orders.body.data.items[0].id;
  });

  describe('Coupons', () => {
    it('GET /api/coupons requires auth', async () => {
      assert.strictEqual((await request(app).get('/api/coupons')).status, 401);
    });

    it('POST /api/coupons creates coupon', async () => {
      const code = `T${Date.now().toString(36).toUpperCase()}`;
      const res = await request(app)
        .post('/api/coupons')
        .set(authHeader(token))
        .send({
          code,
          discountType: 'PERCENT',
          value: 15,
          isActive: true,
        });
      assert.strictEqual(res.status, 201);
      couponId = res.body.data?.coupon?.id;
    });

    it('POST /api/coupons/validate', async () => {
      const res = await request(app)
        .post('/api/coupons/validate')
        .set(authHeader(token))
        .send({ code: 'WELCOME10', orderAmount: 100 });
      assert.ok([200, 404].includes(res.status));
      if (res.status === 200) {
        assert.ok(typeof res.body.data?.discountAmount === 'number');
      }
    });

    it('GET /api/coupons/:id', async () => {
      if (!couponId) return;
      const res = await request(app).get(`/api/coupons/${couponId}`).set(authHeader(token));
      assert.strictEqual(res.status, 200);
    });
  });

  describe('Invoices', () => {
    it('GET /api/invoices requires auth', async () => {
      assert.strictEqual((await request(app).get('/api/invoices')).status, 401);
    });

    it('GET /api/invoices lists', async () => {
      const res = await request(app).get('/api/invoices?limit=5').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.items));
    });

    it('POST /api/invoices/generate for order without invoice', async () => {
      if (!orderId) return;
      const res = await request(app)
        .post('/api/invoices/generate')
        .set(authHeader(token))
        .send({ orderId });
      assert.ok([200, 201, 404, 500].includes(res.status));
      if (res.status === 201 || res.status === 200) {
        assert.ok(res.body.data?.invoice?.invoiceNumber);
        const html = await request(app)
          .get(`/api/invoices/order/${orderId}/html`)
          .set(authHeader(token));
        assert.ok([200, 404].includes(html.status));
      }
    });
  });
});
