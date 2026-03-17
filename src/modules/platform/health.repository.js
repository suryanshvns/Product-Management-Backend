const { prisma } = require('../../database/client');

const checkDatabase = async () => {
  await prisma.$queryRaw`SELECT 1`;
};

module.exports = {
  checkDatabase,
};
