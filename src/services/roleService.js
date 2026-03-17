const roleRepository = require('../repositories/roleRepository');
const userRepository = require('../repositories/userRepository');
const { NotFoundError, ValidationError } = require('../utils/errors');

const listRoles = async () => {
  return roleRepository.findMany();
};

const assignRoleToUser = async (userId, roleId) => {
  const [role, user, userRoles] = await Promise.all([
    roleRepository.findById(roleId),
    userRepository.findById(userId),
    roleRepository.getUserRoles(userId),
  ]);
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  if (!user) {
    throw new NotFoundError('User not found');
  }
  const alreadyHas = userRoles.some(ur => ur.roleId === roleId);
  if (alreadyHas) {
    throw new ValidationError('User already has this role');
  }
  const created = await roleRepository.assignRoleToUser(userId, roleId);
  return {
    user: created.user,
    role: created.role,
  };
};

const revokeRoleFromUser = async (userId, roleId) => {
  const [role, user] = await Promise.all([
    roleRepository.findById(roleId),
    userRepository.findById(userId),
  ]);
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  if (!user) {
    throw new NotFoundError('User not found');
  }
  const result = await roleRepository.revokeRoleFromUser(userId, roleId);
  if (result.count === 0) {
    throw new NotFoundError('User does not have this role');
  }
  return { revoked: true };
};

module.exports = {
  listRoles,
  assignRoleToUser,
  revokeRoleFromUser,
};
