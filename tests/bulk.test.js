const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Bulk API', () => {
  let token;
  let categoryId;

  it('get token and category', async () => {
    token = await getToken();
    const catRes = await request(app).get('/api/categories').set(authHeader(token));
    if (catRes.body.data?.categories?.length > 0) {
      categoryId = catRes.body.data.categories[0].id;
    }
  });

  describe('POST /api/bulk/import/products', () => {
    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/bulk/import/products')
        .send({ csv: 'name,categoryId\nA,' });
      assert.strictEqual(res.status, 401);
    });

    it('should return 400 when csv missing', async () => {
      const res = await request(app)
        .post('/api/bulk/import/products')
        .set(authHeader(token))
        .send({});
      assert.strictEqual(res.status, 400);
    });

    it('should return 200 and result when valid CSV (if category exists)', async () => {
      if (!categoryId) return;
      const csv = `name,categoryId\nBulk Product 1,${categoryId}\nBulk Product 2,${categoryId}`;
      const res = await request(app)
        .post('/api/bulk/import/products')
        .set(authHeader(token))
        .send({ csv });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(typeof res.body.data.created === 'number');
      assert.ok(Array.isArray(res.body.data.errors));
    });
  });
});
