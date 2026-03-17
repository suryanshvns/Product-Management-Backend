const { apiKeyRepository, hashKey } = require('../repositories/apiKeyRepository');
const { NotFoundError } = require('../utils/errors');

const apiKeyService = {
  create: async (name, userId, organizationId) => {
    return apiKeyRepository.create(name, userId, organizationId);
  },

  findByKey: async (rawKey) => {
    return apiKeyRepository.findByHash(hashKey(rawKey));
  },

  list: async (userId, organizationId) => {
    return apiKeyRepository.findMany(userId, organizationId);
  },

  revoke: async (id) => {
    try {
      return await apiKeyRepository.delete(id);
    } catch (err) {
      if (err.code === 'P2025') throw new NotFoundError('API key not found');
      throw err;
    }
  },
};

module.exports = apiKeyService;
