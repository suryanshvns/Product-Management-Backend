const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Engagement API (reviews & wishlist)', () => {
  let token;
  let productId;
  let editorToken;

  it('setup', async () => {
    token = await getToken();
    const loginEditor = await request(app)
      .post('/api/auth/login')
      .send({ email: 'james.editor@company.com', password: 'test' });
    if (loginEditor.status === 200 && loginEditor.body.data?.accessToken) {
      editorToken = loginEditor.body.data.accessToken;
    }
    const pr = await request(app).get('/api/products?limit=1').set(authHeader(token));
    if (pr.body.data?.items?.length) productId = pr.body.data.items[0].id;
  });

  describe('Reviews', () => {
    it('GET /api/reviews/product/:id without auth', async () => {
      if (!productId) return;
      const res = await request(app).get(`/api/reviews/product/${productId}?limit=5`);
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.data?.items));
    });

    it('POST review requires auth', async () => {
      if (!productId) return;
      assert.strictEqual(
        (
          await request(app)
            .post('/api/reviews')
            .send({ productId, rating: 5 })
        ).status,
        401
      );
    });

    it('POST review with second user (avoid duplicate product+user)', async () => {
      if (!productId || !editorToken) return;
      const res = await request(app)
        .post('/api/reviews')
        .set(authHeader(editorToken))
        .send({ productId, rating: 4, comment: 'API test review' });
      assert.ok([200, 201, 400].includes(res.status));
    });
  });

  describe('Wishlist', () => {
    it('requires auth', async () => {
      assert.strictEqual((await request(app).get('/api/wishlist')).status, 401);
    });

    it('POST and GET wishlist', async () => {
      if (!productId) return;
      await request(app)
        .delete(`/api/wishlist/${productId}`)
        .set(authHeader(token))
        .catch(() => {});
      const add = await request(app)
        .post('/api/wishlist')
        .set(authHeader(token))
        .send({ productId });
      assert.ok([200, 201].includes(add.status) || add.status === 400);
      const list = await request(app).get('/api/wishlist').set(authHeader(token));
      assert.strictEqual(list.status, 200);
    });

    it('DELETE wishlist item', async () => {
      if (!productId) return;
      const res = await request(app).delete(`/api/wishlist/${productId}`).set(authHeader(token));
      assert.ok([200, 404].includes(res.status));
    });
  });
});
