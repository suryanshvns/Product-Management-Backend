const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');
const { getToken, authHeader } = require('./helpers/auth');

describe('Categories API', () => {
  let token;
  let categoryId;

  describe('GET /api/categories', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/categories');
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 and list with token', async () => {
      token = await getToken();
      const res = await request(app).get('/api/categories').set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.data?.categories));
      if (res.body.data.categories.length > 0) categoryId = res.body.data.categories[0].id;
    });
  });

  describe('POST /api/categories', () => {
    it('should return 400 when body invalid', async () => {
      token = token || (await getToken());
      const res = await request(app).post('/api/categories').set(authHeader(token)).send({});
      assert.strictEqual(res.status, 400);
    });

    it('should return 201 and category when valid', async () => {
      token = token || (await getToken());
      const res = await request(app)
        .post('/api/categories')
        .set(authHeader(token))
        .send({ name: `Test Category ${Date.now()}`, description: 'Test' });
      assert.strictEqual(res.status, 201);
      assert.ok(res.body.data.category?.id);
      if (!categoryId) categoryId = res.body.data.category.id;
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return 200 when found', async () => {
      if (!categoryId) return;
      token = token || (await getToken());
      const res = await request(app).get(`/api/categories/${categoryId}`).set(authHeader(token));
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.category.id, categoryId);
    });

    it('should return 404 for invalid id', async () => {
      token = token || (await getToken());
      const res = await request(app)
        .get('/api/categories/invalid-id-123')
        .set(authHeader(token));
      assert.strictEqual(res.status, 404);
    });
  });

  describe('PATCH /api/categories/:id', () => {
    it('should return 200 and updated category', async () => {
      if (!categoryId) return;
      token = token || (await getToken());
      const res = await request(app)
        .patch(`/api/categories/${categoryId}`)
        .set(authHeader(token))
        .send({ name: 'Updated Category Name' });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.category.name, 'Updated Category Name');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should return 404 for invalid id', async () => {
      token = token || (await getToken());
      const res = await request(app)
        .delete('/api/categories/invalid-id-123')
        .set(authHeader(token));
      assert.strictEqual(res.status, 404);
    });
  });
});
