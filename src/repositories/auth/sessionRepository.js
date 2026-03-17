const { prisma } = require('../../database/client');

const sessionRepository = {
  create: async (userId, tokenHash, expiresAt) => {
    const session = await prisma.session.create({
      data: {
        userId,
        token: tokenHash,
        expiresAt,
      },
    });
    return session;
  },

  findByTokenHash: async (tokenHash) => {
    const session = await prisma.session.findFirst({
      where: {
        token: tokenHash,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
    return session;
  },

  deleteById: async (sessionId) => {
    await prisma.session.delete({
      where: { id: sessionId },
    });
  },

  deleteByUserId: async (userId) => {
    await prisma.session.deleteMany({
      where: { userId },
    });
  },
};

module.exports = sessionRepository;
