const organizationRepository = require('../repositories/organizationRepository');
const { NotFoundError, ValidationError } = require('../utils/errors');

const organizationService = {
  create: async (data) => {
    return organizationRepository.create(data);
  },

  getById: async (id) => {
    const org = await organizationRepository.findById(id);
    if (!org) throw new NotFoundError('Organization not found');
    return org;
  },

  listMyOrganizations: async (userId) => {
    return organizationRepository.findManyByUserId(userId);
  },

  addMember: async (organizationId, userId, role) => {
    try {
      return await organizationRepository.addMember(organizationId, userId, role);
    } catch (err) {
      if (err.code === 'P2002') throw new ValidationError('User already in organization');
      throw err;
    }
  },

  getMembers: async (organizationId) => {
    await organizationService.getById(organizationId);
    return organizationRepository.getMembers(organizationId);
  },
};

module.exports = organizationService;
