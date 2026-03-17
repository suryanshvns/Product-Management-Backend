const { prisma } = require('../database/client');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const organizationRepository = {
  create: async (data) => {
    const slug = `${slugify(data.name)}-${Date.now().toString(36)}`;
    return prisma.organization.create({
      data: { name: data.name, slug },
    });
  },

  findById: async (id) => {
    return prisma.organization.findUnique({
      where: { id },
      include: { _count: { select: { members: true, products: true } } },
    });
  },

  findManyByUserId: async (userId) => {
    return prisma.organization.findMany({
      where: { members: { some: { userId } } },
      include: { _count: { select: { members: true } } },
    });
  },

  addMember: async (organizationId, userId, role = 'member') => {
    return prisma.organizationMember.create({
      data: { organizationId, userId, role },
    });
  },

  getMembers: async (organizationId) => {
    return prisma.organizationMember.findMany({
      where: { organizationId },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  },
};

module.exports = organizationRepository;
