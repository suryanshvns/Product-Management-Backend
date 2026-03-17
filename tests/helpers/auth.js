const request = require('supertest');
const app = require('./app');

let cachedToken = null;

async function getToken() {
  if (cachedToken) return cachedToken;
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@company.com', password: 'test' });
  if (res.status !== 200 || !res.body.data?.accessToken) {
    throw new Error('Failed to get test token. Ensure DB is seeded (npm run db:seed).');
  }
  cachedToken = res.body.data.accessToken;
  return cachedToken;
}

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

module.exports = { getToken, authHeader };
