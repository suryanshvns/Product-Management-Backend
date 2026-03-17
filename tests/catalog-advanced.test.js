const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Catalog advanced APIs', () => {
  let token;
  let productId;
  let variantId;
  let tagId;
  let secondProductId;

  it('setup: token, product, variant', async () => {
    token = await getToken();
    const pr = await request(app).get('/api/products?limit=2').set(authHeader(token));
    assert.strictEqual(pr.status, 200);
    const items = pr.body.data?.items || [];
    if (items[0]) productId = items[0].id;
    if (items[1]) secondProductId = items[1].id;
    const vr = await request(app)
      .get(`/api/product-variants?productId=${productId || 'x'}&limit=1`)
      .set(authHeader(token));
    if (vr.status === 200 && vr.body.data?.items?.length) variantId = vr.body.data.items[0].id;
  });

  describe('GET /api/search/products', () => {
    it('should return 200 without auth', async () => {
      const res = await request(app).get('/api/search/products?page=1&limit=5');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.data?.items));
    });

    it('should filter with q and inStock', async () => {
      const res = await request(app).get('/api/search/products?q=test&inStock=true&limit=3');
      assert.strictEqual(res.status, 200);
    });
  });

  describe('GET /api/product-variants', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/product-variants');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 with list', async () => {
      const res = await request(app).get('/api/product-variants?limit=5').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.items));
    });

    it('should return reorder-suggestions', async () => {
      const res = await request(app).get('/api/product-variants/reorder-suggestions').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.suggestions));
    });
  });

  describe('POST /api/product-variants', () => {
    it('should return 400 when invalid', async () => {
      const res = await request(app).post('/api/product-variants').set(authHeader(token)).send({});
      assert.strictEqual(res.status, 400);
    });

    it('should return 201 when valid', async () => {
      if (!productId) return;
      const sku = `TST-SKU-${Date.now()}`;
      const res = await request(app)
        .post('/api/product-variants')
        .set(authHeader(token))
        .send({
          productId,
          sku,
          name: 'Test variant',
          quantity: 5,
          reorderPoint: 2,
          reorderQty: 10,
        });
      assert.strictEqual(res.status, 201);
      assert.ok(res.body.data?.variant?.id);
      variantId = res.body.data.variant.id;
    });
  });

  describe('GET/PATCH /api/product-variants/:id', () => {
    it('should return 404 for bad id', async () => {
      const res = await request(app).get('/api/product-variants/cinvalid123').set(authHeader(token));
      assert.strictEqual(res.status, 404);
    });

    it('should return 200 for existing variant', async () => {
      if (!variantId) return;
      const res = await request(app).get(`/api/product-variants/${variantId}`).set(authHeader(token));
      assert.strictEqual(res.status, 200);
    });

    it('should patch stock delta', async () => {
      if (!variantId) return;
      const res = await request(app)
        .patch(`/api/product-variants/${variantId}/stock`)
        .set(authHeader(token))
        .send({ delta: 1 });
      assert.strictEqual(res.status, 200);
    });
  });

  describe('Tags API', () => {
    it('GET /api/tags should require auth', async () => {
      assert.strictEqual((await request(app).get('/api/tags')).status, 401);
    });

    it('POST and GET /api/tags', async () => {
      const name = `tag-${Date.now()}`;
      const create = await request(app)
        .post('/api/tags')
        .set(authHeader(token))
        .send({ name });
      assert.strictEqual(create.status, 201);
      tagId = create.body.data?.tag?.id;
      const list = await request(app).get('/api/tags?limit=10').set(authHeader(token));
      assert.strictEqual(list.status, 200);
    });

    it('PATCH product tags', async () => {
      if (!productId || !tagId) return;
      const res = await request(app)
        .patch(`/api/tags/product/${productId}`)
        .set(authHeader(token))
        .send({ tagIds: [tagId] });
      assert.strictEqual(res.status, 200);
    });
  });

  describe('Inventory batches', () => {
    it('should return 401 without token', async () => {
      assert.strictEqual((await request(app).get('/api/inventory-batches')).status, 401);
    });

    it('POST batch when variant exists', async () => {
      if (!variantId) return;
      const res = await request(app)
        .post('/api/inventory-batches')
        .set(authHeader(token))
        .send({
          productVariantId: variantId,
          batchNumber: `B-${Date.now()}`,
          quantity: 2,
          expiryDate: new Date(Date.now() + 86400000 * 180).toISOString(),
        });
      assert.ok([200, 201].includes(res.status) || res.status === 400);
    });
  });

  describe('Related products', () => {
    it('should require auth for POST', async () => {
      assert.strictEqual(
        (await request(app).post('/api/related-products').send({})).status,
        401
      );
    });

    it('POST and GET related', async () => {
      if (!productId || !secondProductId || productId === secondProductId) return;
      await request(app)
        .delete(`/api/related-products/${productId}/${secondProductId}`)
        .set(authHeader(token))
        .catch(() => {});
      const post = await request(app)
        .post('/api/related-products')
        .set(authHeader(token))
        .send({ productId, relatedProductId: secondProductId, relationType: 'related' });
      assert.ok([200, 201].includes(post.status) || post.status === 400);
      const get = await request(app)
        .get(`/api/related-products/${productId}`)
        .set(authHeader(token));
      assert.strictEqual(get.status, 200);
      assert.ok(Array.isArray(get.body.data?.products));
    });
  });
});
