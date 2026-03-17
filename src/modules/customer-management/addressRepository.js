const { prisma } = require('../../database/client');

const addressRepository = {
  create: async (data) => prisma.customerAddress.create({ data }),
  findById: async (id) => prisma.customerAddress.findUnique({ where: { id } }),
  findByCustomerId: async (customerId) =>
    prisma.customerAddress.findMany({ where: { customerId }, orderBy: { isDefault: 'desc' } }),
  update: async (id, data) => prisma.customerAddress.update({ where: { id }, data }),
  delete: async (id) => prisma.customerAddress.delete({ where: { id } }),
  setDefault: async (customerId, addressId) => {
    await prisma.customerAddress.updateMany({
      where: { customerId },
      data: { isDefault: false },
    });
    return prisma.customerAddress.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  },
};

module.exports = addressRepository;
