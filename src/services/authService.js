const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../config');
const authRepository = require('../repositories/authRepository');
const sessionRepository = require('../repositories/auth/sessionRepository');
const { UnauthorizedError, ValidationError } = require('../utils/errors');

const SALT_ROUNDS = 10;

const hashRefreshToken = token =>
  crypto.createHash('sha256').update(token).digest('hex');

const generateRefreshToken = () => crypto.randomBytes(32).toString('hex');

const getRoleNames = user => {
  const userRoles = user.userRoles || [];
  return userRoles.map(ur => ur.role.name);
};

const buildAccessTokenPayload = user => {
  const roles = user.userRoles ? getRoleNames(user) : [];
  return {
    sub: user.id,
    email: user.email,
    roles,
  };
};

const createAccessToken = user =>
  jwt.sign(buildAccessTokenPayload(user), config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

const createRefreshTokenAndSession = async user => {
  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);
  const raw = config.jwt.refreshExpiresIn || '7d';
  const match = raw.match(/^(\d+)([dhms])$/);
  const amount = match ? parseInt(match[1], 10) : 7;
  const unit = match ? match[2] : 'd';
  const seconds = amount * ({ d: 86400, h: 3600, m: 60, s: 1 }[unit] || 86400);
  const expiresAt = new Date(Date.now() + seconds * 1000);

  await sessionRepository.create(user.id, tokenHash, expiresAt);
  return refreshToken;
};

const register = async ({ email, password, name }) => {
  const existing = await authRepository.findUserByEmail(email);
  if (existing) {
    throw new ValidationError('Email already registered');
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const created = await authRepository.createUser({
    email,
    password: hashedPassword,
    name: name || null,
  });
  const user = await authRepository.findUserByIdWithRoles(created.id);
  const accessToken = createAccessToken(user);
  const refreshToken = await createRefreshTokenAndSession(user);
  return {
    user: { id: user.id, email: user.email, name: user.name, roles: getRoleNames(user) },
    accessToken,
    refreshToken,
    expiresIn: config.jwt.expiresIn,
    refreshExpiresIn: config.jwt.refreshExpiresIn,
  };
};

const login = async (email, password) => {
  const user = await authRepository.findUserByEmailWithRoles(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }
  await authRepository.updateLastLoginAt(user.id);
  const accessToken = createAccessToken(user);
  const refreshToken = await createRefreshTokenAndSession(user);
  return {
    user: { id: user.id, email: user.email, name: user.name, roles: getRoleNames(user) },
    accessToken,
    refreshToken,
    expiresIn: config.jwt.expiresIn,
    refreshExpiresIn: config.jwt.refreshExpiresIn,
  };
};

const refreshTokens = async refreshToken => {
  if (!refreshToken) {
    throw new UnauthorizedError('Refresh token required');
  }
  const tokenHash = hashRefreshToken(refreshToken);
  const session = await sessionRepository.findByTokenHash(tokenHash);
  if (!session || !session.user) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
  const user = await authRepository.findUserByIdWithRoles(session.user.id);
  await authRepository.updateLastLoginAt(user.id);
  const accessToken = createAccessToken(user);
  const newRefreshToken = await createRefreshTokenAndSession(user);
  await sessionRepository.deleteById(session.id);
  return {
    user: { id: user.id, email: user.email, name: user.name, roles: getRoleNames(user) },
    accessToken,
    refreshToken: newRefreshToken,
    expiresIn: config.jwt.expiresIn,
    refreshExpiresIn: config.jwt.refreshExpiresIn,
  };
};

const logout = async refreshToken => {
  if (!refreshToken) {
    return;
  }
  const tokenHash = hashRefreshToken(refreshToken);
  const session = await sessionRepository.findByTokenHash(tokenHash);
  if (session) {
    await sessionRepository.deleteById(session.id);
  }
};

const getMe = async userId => {
  const user = await authRepository.findUserByIdWithRoles(userId);
  if (!user) {
    throw new UnauthorizedError('User not found');
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    lastLoginAt: user.lastLoginAt ?? null,
    roles: getRoleNames(user),
  };
};

module.exports = {
  register,
  login,
  refreshTokens,
  logout,
  getMe,
};
