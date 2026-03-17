const authService = require('./auth.service');
const { HTTP_STATUS } = require('../../constants');

const authController = {
  signup: async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      const result = await authService.register({ email, password, name });
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Logged out' });
    } catch (err) {
      next(err);
    }
  },
  me: async (req, res, next) => {
    try {
      const user = await authService.getMe(req.user.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { user } });
    } catch (err) {
      next(err);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshTokens(refreshToken);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
