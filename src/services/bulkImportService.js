const productRepository = require('../repositories/productRepository');
const categoryRepository = require('../repositories/categoryRepository');
const { ValidationError } = require('../utils/errors');

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

const bulkImportService = {
  importProducts: async (csvText) => {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) throw new ValidationError('CSV must have header and at least one row');
    const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, '_'));
    const nameIdx = headers.indexOf('name');
    const categoryid_idx = headers.indexOf('categoryid') >= 0 ? headers.indexOf('categoryid') : headers.indexOf('category_id');
    if (nameIdx < 0 || categoryid_idx < 0) {
      throw new ValidationError('CSV must have "name" and "categoryId" (or category_id) columns');
    }

    const results = { created: 0, errors: [] };
    const categories = await categoryRepository.findMany();
    const categoryIds = new Set(categories.map((c) => c.id));

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const name = values[nameIdx]?.trim();
      const categoryId = (values[categoryid_idx] || '').trim();
      if (!name) {
        results.errors.push({ row: i + 1, message: 'Name is required' });
        continue;
      }
      if (!categoryId || !categoryIds.has(categoryId)) {
        results.errors.push({ row: i + 1, message: 'Valid categoryId required' });
        continue;
      }
      try {
        await productRepository.create({ name, categoryId, status: 'draft' });
        results.created += 1;
      } catch (err) {
        results.errors.push({ row: i + 1, message: err.message || 'Create failed' });
      }
    }
    return results;
  },
};

module.exports = bulkImportService;
