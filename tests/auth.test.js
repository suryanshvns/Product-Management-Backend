const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {
    it('should return 400 when body is invalid', async () => {
      const res = await request(app).post('/api/auth/login').send({}).expect('Content-Type', /json/);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.error);
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@company.com', password: 'wrong' })
        .expect('Content-Type', /json/);
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.success, false);
    });

    it('should return 200 and tokens for valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@company.com', password: 'test' })
        .expect('Content-Type', /json/);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.accessToken);
      assert.ok(res.body.data.refreshToken);
      assert.ok(res.body.data.user);
      assert.strictEqual(res.body.data.user.email, 'admin@company.com');
    });
  });

  describe('POST /api/auth/signup', () => {
    it('should return 201 and tokens for valid body', async () => {
      const email = `test-${Date.now()}@example.com`;
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email, password: 'password123', name: 'Test User' })
        .expect('Content-Type', /json/);
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.accessToken);
      assert.ok(res.body.data.user);
      assert.strictEqual(res.body.data.user.email, email);
    });

    it('should return 400 when email already exists', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'admin@company.com', password: 'password123' })
        .expect('Content-Type', /json/);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/auth/me').expect('Content-Type', /json/);
      assert.strictEqual(res.status, 401);
    });

    it('should return 200 with valid token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@company.com', password: 'test' });
      const token = loginRes.body.data.accessToken;
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.user);
      assert.strictEqual(res.body.data.user.email, 'admin@company.com');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return 200 with valid refreshToken in body', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@company.com', password: 'test' });
      const refreshToken = loginRes.body.data.refreshToken;
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${loginRes.body.data.accessToken}`)
        .send({ refreshToken })
        .expect('Content-Type', /json/);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    it('should return 400 when refreshToken missing', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({})
        .expect('Content-Type', /json/);
      assert.strictEqual(res.status, 400);
    });

    it('should return 200 and new tokens with valid refreshToken', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@company.com', password: 'test' });
      const refreshToken = loginRes.body.data.refreshToken;
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken })
        .expect('Content-Type', /json/);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.accessToken);
      assert.ok(res.body.data.refreshToken);
    });
  });
});
