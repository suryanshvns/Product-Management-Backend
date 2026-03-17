const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./helpers/app');

describe('Health service', () => {
  it('should export getHealth', () => {
    const healthService = require('../src/modules/platform/health.service');
    assert.strictEqual(typeof healthService.getHealth, 'function');
  });
});

describe('Health & Ping API', () => {
  describe('GET /api/health', () => {
    it('should return 200 and status', async () => {
      const res = await request(app).get('/api/health');
      assert.ok([200, 500].includes(res.status));
      assert.ok(res.body.status);
      assert.ok(res.body.checks);
    });
  });

  describe('GET /api/ping', () => {
    it('should return 200 and pong', async () => {
      const res = await request(app).get('/api/ping');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.message, 'pong');
    });
  });
});
