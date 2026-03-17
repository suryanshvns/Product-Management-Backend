const config = require('../config');

/**
 * Returns a display-ready absolute URL for an image.
 * - If url is already http(s), return as-is.
 * - If API_BASE_URL is set, prepend it to relative paths.
 * - Otherwise return relative url (frontend can prepend origin).
 */
function toDisplayUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = (config.apiBaseUrl || '').replace(/\/$/, '');
  return base ? `${base}${url.startsWith('/') ? '' : '/'}${url}` : url;
}

/**
 * Attach imageUrl (display-ready) to each product image so the frontend can use it in <img src={image.imageUrl} />.
 */
function withImageUrls(productOrProducts) {
  const mapOne = (p) => {
    if (!p || !p.images) return p;
    return {
      ...p,
      images: p.images.map((img) => ({
        ...img,
        imageUrl: toDisplayUrl(img.url),
      })),
    };
  };
  return Array.isArray(productOrProducts)
    ? productOrProducts.map(mapOne)
    : mapOne(productOrProducts);
}

module.exports = { toDisplayUrl, withImageUrls };
