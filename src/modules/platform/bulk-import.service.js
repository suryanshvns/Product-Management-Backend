const productRepository = require('../catalog/product.repository');
const categoryRepository = require('../catalog/category.repository');
const { ValidationError } = require('../../utils/errors');

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if ((c === ',' && !inQuotes) || c === '\n' || c === '\r') {
      result.push(current.trim());
      current = '';
      if (c !== ',') break;
    } else {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}

/** Resolve categoryId to DB id: if it's a cuid use as-is, else treat as slug (e.g. cat_electronics → electronics). */
function resolveCategoryId(categoryId, categoryIdsSet, slugToId) {
  if (!categoryId) return null;
  const trimmed = categoryId.trim();
  if (categoryIdsSet.has(trimmed)) return trimmed;
  const normalizedSlug = trimmed
    .replace(/^cat_/, '')
    .replace(/_/g, '-')
    .toLowerCase();
  return (
    slugToId[normalizedSlug] ||
    slugToId[trimmed] ||
    (normalizedSlug.endsWith('s')
      ? slugToId[normalizedSlug.slice(0, -1)]
      : null) ||
    slugToId[normalizedSlug + 's'] ||
    null
  );
}

const bulkImportService = {
  importProducts: async csvText => {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2)
      throw new ValidationError('CSV must have header and at least one row');
    const headers = parseCsvLine(lines[0]).map(h =>
      h.toLowerCase().replace(/\s+/g, '_')
    );
    const nameIdx = headers.indexOf('name');
    const categoryidIdx =
      headers.indexOf('categoryid') >= 0
        ? headers.indexOf('categoryid')
        : headers.indexOf('category_id');
    const priceIdx = headers.indexOf('price');
    const stockIdx = headers.indexOf('stock');
    const descriptionIdx = headers.indexOf('description');
    const statusIdx = headers.indexOf('status');
    const imageUrlIdx = headers.indexOf('imageurl') >= 0 ? headers.indexOf('imageurl') : headers.indexOf('image_url');
    const imageUrlsIdx = headers.indexOf('imageurls') >= 0 ? headers.indexOf('imageurls') : headers.indexOf('image_urls');
    if (nameIdx < 0 || categoryidIdx < 0) {
      throw new ValidationError(
        'CSV must have "name" and "categoryId" (or category_id) columns'
      );
    }

    const results = { created: 0, errors: [] };
    const categories = await categoryRepository.findMany();
    const categoryIdsSet = new Set(categories.map(c => c.id));
    const slugToId = {};
    for (const c of categories) {
      if (!c.slug) continue;
      slugToId[c.slug] = c.id;
      const firstPart = c.slug.split('-')[0];
      if (firstPart && !slugToId[firstPart]) slugToId[firstPart] = c.id;
    }

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const name = values[nameIdx]?.trim();
      const categoryIdRaw = (values[categoryidIdx] || '').trim();
      const categoryId = resolveCategoryId(
        categoryIdRaw,
        categoryIdsSet,
        slugToId
      );
      const priceVal = priceIdx >= 0 ? values[priceIdx]?.trim() : '';
      const stockVal = stockIdx >= 0 ? values[stockIdx]?.trim() : '';
      const description =
        descriptionIdx >= 0 ? values[descriptionIdx]?.trim() : null;
      const statusVal = statusIdx >= 0 ? values[statusIdx]?.trim() : 'draft';
      const imageUrlVal = imageUrlIdx >= 0 ? values[imageUrlIdx]?.trim() : '';
      const imageUrlsVal = imageUrlsIdx >= 0 ? values[imageUrlsIdx]?.trim() : '';

      if (!name) {
        results.errors.push({ row: i + 1, message: 'Name is required' });
        continue;
      }
      if (!categoryId) {
        results.errors.push({
          row: i + 1,
          message: `Valid categoryId or category slug required (got: ${categoryIdRaw})`,
        });
        continue;
      }
      const status = ['draft', 'active', 'archived'].includes(statusVal)
        ? statusVal
        : 'draft';
      const price =
        priceVal !== '' && !Number.isNaN(Number(priceVal))
          ? Number(priceVal)
          : null;
      const stock =
        stockVal !== '' && !Number.isNaN(Number(stockVal))
          ? parseInt(stockVal, 10)
          : null;

      try {
        const productData = {
          name,
          categoryId,
          status,
          description: description || undefined,
        };
        if (price != null) productData.price = price;
        const product = await productRepository.create(productData);
        if (stock != null && stock >= 0) {
          await productRepository.upsertInventory(product.id, stock, 10);
        }
        const imageUrls = [];
        if (imageUrlVal && (imageUrlVal.startsWith('http://') || imageUrlVal.startsWith('https://')))
          imageUrls.push(imageUrlVal);
        if (imageUrlsVal)
          imageUrls.push(...imageUrlsVal.split(/[|;]/).map(u => u.trim()).filter(u => u.startsWith('http://') || u.startsWith('https://')));
        for (let j = 0; j < imageUrls.length; j++) {
          await productRepository.createImage(product.id, imageUrls[j], name, j);
        }
        results.created += 1;
      } catch (err) {
        results.errors.push({
          row: i + 1,
          message: err.message || 'Create failed',
        });
      }
    }
    return results;
  },
};

module.exports = bulkImportService;
