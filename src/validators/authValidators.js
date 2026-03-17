const { z } = require('zod');

const signup = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

const login = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const logout = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const refreshToken = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

module.exports = {
  signup,
  login,
  logout,
  refreshToken,
};
