const productService = require('../services/productService');
const { HTTP_STATUS } = require('../constants');
const config = require('../config');

/** Attach imageUrl (absolute) to each product image when API_BASE_URL is set. */
function withImageUrls(productOrProducts) {
  const base = (config.apiBaseUrl || '').replace(/\/$/, '');
  const mapOne = (p) => {
    if (!p || !p.images) return p;
    return {
      ...p,
      images: p.images.map((img) => ({
        ...img,
        ...(base && img.url ? { imageUrl: `${base}${img.url.startsWith('/') ? '' : '/'}${img.url}` } : {}),
      })),
    };
  };
  return Array.isArray(productOrProducts)
    ? productOrProducts.map(mapOne)
    : mapOne(productOrProducts);
}

const productController = {
  create: async (req, res, next) => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { product: withImageUrls(product) } });
    } catch (err) {
      next(err);
    }
  },

  list: async (req, res, next) => {
    try {
      const { page, limit, search, categoryId } = req.query;
      const result = await productService.listProducts({
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        search,
        categoryId,
      });
      const data = {
        ...result,
        items: withImageUrls(result.items || []),
      };
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { product: withImageUrls(product) } });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { product: withImageUrls(product) } });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Product deleted' });
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const product = await productService.updateProductStatus(req.params.id, req.body.status);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { product: withImageUrls(product) } });
    } catch (err) {
      next(err);
    }
  },

  updateStock: async (req, res, next) => {
    try {
      const { quantity, lowStockThreshold } = req.body;
      const product = await productService.updateProductStock(
        req.params.id,
        quantity,
        lowStockThreshold
      );
      res.status(HTTP_STATUS.OK).json({ success: true, data: { product: withImageUrls(product) } });
    } catch (err) {
      next(err);
    }
  },

  bulkDelete: async (req, res, next) => {
    try {
      const result = await productService.bulkDelete(req.body.ids);
      res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  bulkUpdateStatus: async (req, res, next) => {
    try {
      const result = await productService.bulkUpdateStatus(req.body.ids, req.body.status);
      const data = result.products
        ? { ...result, products: withImageUrls(result.products) }
        : result;
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  addImages: async (req, res, next) => {
    try {
      // Support both "images" and "image" field names (multer puts them in req.files.images / req.files.image)
      const files = [].concat(
        req.files?.images || [],
        req.files?.image || []
      );
      if (!files.length) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No files uploaded. Use multipart field name: images (or image).',
          },
        });
      }
      const product = await productService.addImages(
        req.params.id,
        files,
        req.body.alt
      );
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: { product: withImageUrls(product) } });
    } catch (err) {
      next(err);
    }
  },

  deleteImage: async (req, res, next) => {
    try {
      const product = await productService.deleteImage(req.params.id, req.params.imageId);
      res.status(HTTP_STATUS.OK).json({ success: true, data: { product: withImageUrls(product) } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = productController;
