const customerGroupRepository = require('./customerGroupRepository');
const { NotFoundError, ValidationError } = require('../../utils/errors');

const customerGroupService = {
  create: async (data) => {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await customerGroupRepository.findBySlug(slug);
    if (existing) throw new ValidationError('Group with this slug already exists');
    return customerGroupRepository.create({ ...data, slug });
  },
  getById: async (id) => {
    const g = await customerGroupRepository.findById(id);
    if (!g) throw new NotFoundError('Customer group not found');
    return g;
  },
  list: async (filters) => customerGroupRepository.findMany(filters),
  update: async (id, data) => {
    const g = await customerGroupRepository.findById(id);
    if (!g) throw new NotFoundError('Customer group not found');
    return customerGroupRepository.update(id, data);
  },
  delete: async (id) => {
    const g = await customerGroupRepository.findById(id);
    if (!g) throw new NotFoundError('Customer group not found');
    return customerGroupRepository.delete(id);
  },
};

module.exports = customerGroupService;
