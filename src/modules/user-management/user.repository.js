const { prisma } = require('../../database/client');

const userWithRolesInclude = {
  userRoles: {
    include: { role: true },
  },
};

const userRepository = {
  findById: async id => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        userRoles: { include: { role: true } },
      },
    });
  },

  findMany: async ({ skip, take, search }) => {
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          userRoles: { include: { role: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);
    return { users, total };
  },

  update: async (id, data) => {
    return prisma.user.update({
      where: { id },
      data: { name: data.name },
      select: {
        id: true,
        email: true,
        name: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        userRoles: { include: { role: true } },
      },
    });
  },
};

module.exports = userRepository;
