const addressRepository = require('./addressRepository');
const { NotFoundError } = require('../../utils/errors');
const { prisma } = require('../../database/client');

const addressService = {
  create: async (data) => {
    const customer = await prisma.customer.findUnique({ where: { id: data.customerId } });
    if (!customer) throw new NotFoundError('Customer not found');
    return addressRepository.create(data);
  },
  getById: async (id) => {
    const a = await addressRepository.findById(id);
    if (!a) throw new NotFoundError('Address not found');
    return a;
  },
  listByCustomer: async (customerId) => addressRepository.findByCustomerId(customerId),
  update: async (id, data) => {
    const a = await addressRepository.findById(id);
    if (!a) throw new NotFoundError('Address not found');
    return addressRepository.update(id, data);
  },
  delete: async (id) => {
    const a = await addressRepository.findById(id);
    if (!a) throw new NotFoundError('Address not found');
    return addressRepository.delete(id);
  },
  setDefault: async (customerId, addressId) => {
    const a = await addressRepository.findById(addressId);
    if (!a || a.customerId !== customerId) throw new NotFoundError('Address not found');
    return addressRepository.setDefault(customerId, addressId);
  },
};

module.exports = addressService;
