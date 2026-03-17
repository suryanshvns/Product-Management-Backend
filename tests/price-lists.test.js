const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Price lists API', () => {
  let token;
  let priceListId;
  let variantId;

  it('setup', async () => {
    token = await getToken();
    const vr = await request(app).get('/api/product-variants?limit=1').set(authHeader(token));
    if (vr.body.data?.items?.length) variantId = vr.body.data.items[0].id;
  });

  it('GET requires auth', async () => {
    assert.strictEqual((await request(app).get('/api/price-lists')).status, 401);
  });

  it('POST and list price lists', async () => {
    const create = await request(app)
      .post('/api/price-lists')
      .set(authHeader(token))
      .send({ name: `PL-${Date.now()}`, isDefault: false });
    assert.strictEqual(create.status, 201);
    priceListId = create.body.data?.priceList?.id;
    const list = await request(app).get('/api/price-lists').set(authHeader(token));
    assert.strictEqual(list.status, 200);
  });

  it('GET by id and POST item', async () => {
    if (!priceListId || !variantId) return;
    const get = await request(app).get(`/api/price-lists/${priceListId}`).set(authHeader(token));
    assert.strictEqual(get.status, 200);
    const item = await request(app)
      .post(`/api/price-lists/${priceListId}/items`)
      .set(authHeader(token))
      .send({ productVariantId: variantId, price: 12.5 });
    assert.ok([200, 201].includes(item.status));
  });
});
