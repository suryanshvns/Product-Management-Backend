const userRepository = require('../repositories/userRepository');
const { NotFoundError } = require('../utils/errors');

const formatUser = (user) => {
  if (!user) return null;
  const roles = (user.userRoles || []).map((ur) => ur.role.name);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    lastLoginAt: user.lastLoginAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles,
  };
};

const listUsers = async ({ page, limit, search }) => {
  const skip = (page - 1) * limit;
  const { users, total } = await userRepository.findMany({ skip, take: limit, search });
  return {
    users: users.map(formatUser),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return formatUser(user);
};

const updateUser = async (id, data) => {
  const existing = await userRepository.findById(id);
  if (!existing) {
    throw new NotFoundError('User not found');
  }
  const updated = await userRepository.update(id, data);
  return formatUser(updated);
};

module.exports = {
  listUsers,
  getUserById,
  updateUser,
};
