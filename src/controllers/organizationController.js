const organizationService = require('../services/organizationService');
const { HTTP_STATUS } = require('../constants');

const organizationController = {
  create: async (req, res, next) => {
    try {
      const org = await organizationService.create(req.body);
      await organizationService.addMember(org.id, req.user.id, 'admin');
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { organization: org } });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const organizations = await organizationService.listMyOrganizations(req.user.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { organizations } });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const organization = await organizationService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { organization } });
    } catch (err) {
      next(err);
    }
  },

  addMember: async (req, res, next) => {
    try {
      const member = await organizationService.addMember(
        req.params.id,
        req.body.userId,
        req.body.role
      );
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { member } });
    } catch (err) {
      next(err);
    }
  },

  getMembers: async (req, res, next) => {
    try {
      const members = await organizationService.getMembers(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { members } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = organizationController;
