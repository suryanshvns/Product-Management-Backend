const { prisma } = require('../../database/client');

const roleRepository = {
  findMany: async () => {
    return prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
  },

  findById: async (id) => {
    return prisma.role.findUnique({
      where: { id },
    });
  },

  findByName: async (name) => {
    return prisma.role.findUnique({
      where: { name },
    });
  },

  assignRoleToUser: async (userId, roleId) => {
    return prisma.userRole.create({
      data: { userId, roleId },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
        role: true,
      },
    });
  },

  revokeRoleFromUser: async (userId, roleId) => {
    return prisma.userRole.deleteMany({
      where: { userId, roleId },
    });
  },

  getUserRoles: async (userId) => {
    return prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
  },
};

module.exports = roleRepository;
