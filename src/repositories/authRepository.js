const { prisma } = require('../database/client');

const userWithRolesInclude = {
  userRoles: {
    include: { role: true },
  },
};

const authRepository = {
  createUser: async userData => {
    const user = await prisma.user.create({
      data: userData,
    });
    return user;
  },

  findUserByEmail: async email => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  },

  findUserByEmailWithRoles: async email => {
    const user = await prisma.user.findUnique({
      where: { email },
      include: userWithRolesInclude,
    });
    return user;
  },

  findUserById: async id => {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  },

  findUserByIdWithRoles: async id => {
    const user = await prisma.user.findUnique({
      where: { id },
      include: userWithRolesInclude,
    });
    return user;
  },

  updateLastLoginAt: async userId => {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  },
};

module.exports = authRepository;
