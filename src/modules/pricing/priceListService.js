const priceListRepository = require('./priceListRepository');
const { NotFoundError } = require('../../utils/errors');

const priceListService = {
  create: async (data) => priceListRepository.create(data),
  getById: async (id) => {
    const p = await priceListRepository.findById(id);
    if (!p) throw new NotFoundError('Price list not found');
    return p;
  },
  list: async (filters) => priceListRepository.findMany(filters),
  update: async (id, data) => {
    const p = await priceListRepository.findById(id);
    if (!p) throw new NotFoundError('Price list not found');
    return priceListRepository.update(id, data);
  },
  delete: async (id) => {
    const p = await priceListRepository.findById(id);
    if (!p) throw new NotFoundError('Price list not found');
    return priceListRepository.delete(id);
  },
  setItem: async (priceListId, productVariantId, price) => {
    const p = await priceListRepository.findById(priceListId);
    if (!p) throw new NotFoundError('Price list not found');
    return priceListRepository.setItem(priceListId, productVariantId, price);
  },
};

module.exports = priceListService;
