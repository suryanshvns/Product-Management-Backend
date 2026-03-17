const categoryService = require('../services/categoryService');
const { HTTP_STATUS } = require('../constants');

const categoryController = {
  create: async (req, res, next) => {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { category } });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const categories = await categoryService.listCategories();
      res.status(HTTP_STATUS.OK).json({ success: true, data: { categories } });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { category } });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { category } });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await categoryService.deleteCategory(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Category deleted' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = categoryController;
