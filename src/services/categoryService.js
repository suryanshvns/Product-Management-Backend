const categoryRepository = require('../repositories/categoryRepository');
const { NotFoundError, ValidationError } = require('../utils/errors');

const categoryService = {
  createCategory: async (data) => {
    const category = await categoryRepository.create(data);
    if (!category) throw new ValidationError('Failed to create category');
    return category;
  },

  listCategories: async () => {
    return categoryRepository.findMany();
  },

  getCategoryById: async (id) => {
    const category = await categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  },

  updateCategory: async (id, data) => {
    try {
      const category = await categoryRepository.update(id, data);
      return category;
    } catch (err) {
      if (err.code === 'P2025') throw new NotFoundError('Category not found');
      throw err;
    }
  },

  deleteCategory: async (id) => {
    try {
      const category = await categoryRepository.delete(id);
      return category;
    } catch (err) {
      if (err.code === 'P2025') throw new NotFoundError('Category not found');
      if (err.code === 'P2003') throw new ValidationError('Category has products; remove or reassign them first');
      throw err;
    }
  },
};

module.exports = categoryService;
