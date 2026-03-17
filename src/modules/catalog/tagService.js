const tagRepository = require('./tagRepository');
const { NotFoundError, ValidationError } = require('../../utils/errors');

const tagService = {
  create: async (data) => {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await tagRepository.findBySlug(slug);
    if (existing) throw new ValidationError('Tag with this slug already exists');
    return tagRepository.create({ ...data, slug });
  },

  getById: async (id) => {
    const tag = await tagRepository.findById(id);
    if (!tag) throw new NotFoundError('Tag not found');
    return tag;
  },

  list: async (filters) => tagRepository.findMany(filters),

  update: async (id, data) => {
    const tag = await tagRepository.findById(id);
    if (!tag) throw new NotFoundError('Tag not found');
    return tagRepository.update(id, data);
  },

  delete: async (id) => {
    const tag = await tagRepository.findById(id);
    if (!tag) throw new NotFoundError('Tag not found');
    return tagRepository.delete(id);
  },

  setProductTags: async (productId, tagIds) => {
    return tagRepository.setProductTags(productId, tagIds);
  },

  bulkUpdateTag: async (tagId, productIdsToAdd, productIdsToRemove) => {
    const tag = await tagRepository.findById(tagId);
    if (!tag) throw new NotFoundError('Tag not found');
    for (const pid of productIdsToRemove || [])
      await tagRepository.removeFromProduct(pid, tagId).catch(() => {});
    for (const pid of productIdsToAdd || [])
      await tagRepository.addToProduct(pid, tagId).catch(() => {});
    return tagRepository.findById(tagId);
  },
};

module.exports = tagService;
