/**
 * Export the Express app for supertest (no server listen).
 * Use: const request = require('supertest')(require('../helpers/app'));
 */
module.exports = require('../../src/app');
