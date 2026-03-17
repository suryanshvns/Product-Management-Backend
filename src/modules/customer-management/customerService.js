const customerRepository = require('./customerRepository');
const { NotFoundError } = require('../../utils/errors');

const customerService = {
  create: async (data) => customerRepository.create(data),
  getById: async (id) => {
    const c = await customerRepository.findById(id);
    if (!c) throw new NotFoundError('Customer not found');
    return c;
  },
  list: async (filters) => customerRepository.findMany(filters),
  update: async (id, data) => {
    const c = await customerRepository.findById(id);
    if (!c) throw new NotFoundError('Customer not found');
    return customerRepository.update(id, data);
  },
  delete: async (id) => {
    const c = await customerRepository.findById(id);
    if (!c) throw new NotFoundError('Customer not found');
    return customerRepository.delete(id);
  },
};

module.exports = customerService;
