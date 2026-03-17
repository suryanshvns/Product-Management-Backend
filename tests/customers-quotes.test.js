const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Customer management & Quotes API', () => {
  let token;
  let groupId;
  let customerId;
  let addressId;
  let quoteId;
  let variantId;

  it('setup', async () => {
    token = await getToken();
    const groups = await request(app).get('/api/customer-groups?limit=1').set(authHeader(token));
    if (groups.body.data?.items?.length) groupId = groups.body.data.items[0].id;
    const vr = await request(app).get('/api/product-variants?limit=1').set(authHeader(token));
    if (vr.body.data?.items?.length) variantId = vr.body.data.items[0].id;
  });

  describe('Customer groups', () => {
    it('requires auth', async () => {
      assert.strictEqual((await request(app).get('/api/customer-groups')).status, 401);
    });

    it('POST and list', async () => {
      const slug = `grp-${Date.now()}`;
      const create = await request(app)
        .post('/api/customer-groups')
        .set(authHeader(token))
        .send({ name: `Group ${Date.now()}`, slug });
      assert.strictEqual(create.status, 201);
      groupId = create.body.data?.group?.id || groupId;
      const list = await request(app).get('/api/customer-groups').set(authHeader(token));
      assert.strictEqual(list.status, 200);
    });
  });

  describe('Customers', () => {
    it('POST customer', async () => {
      const res = await request(app)
        .post('/api/customers')
        .set(authHeader(token))
        .send({
          contactName: 'API Test Contact',
          email: `cust-${Date.now()}@test.com`,
          customerGroupId: groupId || undefined,
        });
      assert.strictEqual(res.status, 201);
      customerId = res.body.data?.customer?.id;
    });

    it('GET list and by id', async () => {
      const list = await request(app).get('/api/customers?limit=5').set(authHeader(token));
      assert.strictEqual(list.status, 200);
      if (customerId) {
        const one = await request(app).get(`/api/customers/${customerId}`).set(authHeader(token));
        assert.strictEqual(one.status, 200);
      }
    });
  });

  describe('Customer addresses', () => {
    it('POST address', async () => {
      if (!customerId) return;
      const res = await request(app)
        .post('/api/customer-addresses')
        .set(authHeader(token))
        .send({
          customerId,
          line1: '100 Test St',
          city: 'NYC',
          postalCode: '10001',
          country: 'USA',
          isDefault: true,
        });
      assert.strictEqual(res.status, 201);
      addressId = res.body.data?.address?.id;
    });

    it('GET by customer', async () => {
      if (!customerId) return;
      const res = await request(app)
        .get(`/api/customer-addresses/customer/${customerId}`)
        .set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.addresses));
    });
  });

  describe('Quotes', () => {
    it('POST quote', async () => {
      if (!customerId) return;
      const res = await request(app)
        .post('/api/quotes')
        .set(authHeader(token))
        .send({
          customerId,
          validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
        });
      assert.strictEqual(res.status, 201);
      quoteId = res.body.data?.quote?.id;
    });

    it('POST quote line and GET quote', async () => {
      if (!quoteId || !variantId) return;
      const line = await request(app)
        .post(`/api/quotes/${quoteId}/lines`)
        .set(authHeader(token))
        .send({ productVariantId: variantId, quantity: 2, unitPrice: 19.99 });
      assert.ok([200, 201].includes(line.status));
      const get = await request(app).get(`/api/quotes/${quoteId}`).set(authHeader(token));
      assert.strictEqual(get.status, 200);
    });
  });
});
