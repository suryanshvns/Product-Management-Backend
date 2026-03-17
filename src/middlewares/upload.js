const path = require('path');
const fs = require('fs');
const multer = require('multer');
const config = require('../config');
const { ValidationError } = require('../utils/errors');

const uploadDir = path.join(process.cwd(), config.upload.dir, 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = (file.mimetype === 'image/jpeg' ? 'jpg' : file.mimetype.split('/')[1]) || 'jpg';
    const name = `${req.params.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`Invalid file type. Allowed: ${config.upload.allowedMimeTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxFileSize },
});

const uploadProductImages = (req, res, next) => {
  // Accept either "images" (plural) or "image" (singular) field name
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'image', maxCount: 5 },
  ])(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ValidationError(`File too large. Max ${config.upload.maxFileSize / 1024 / 1024}MB`));
      }
      if (err.code === 'LIMIT_FILE_COUNT') return next(new ValidationError('Max 5 images per request'));
      return next(err);
    }
    next();
  });
};

module.exports = {
  uploadProductImages,
};
