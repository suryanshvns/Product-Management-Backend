const { ValidationError } = require('../utils/errors');

const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    try {
      const data = req[source];
      const result = schema.safeParse(data);
      if (!result.success) {
        const details = result.error.flatten();
        throw new ValidationError('Validation failed', details);
      }
      req[source] = result.data;
      next();
    } catch (err) {
      next(err);
    }
  };

module.exports = validate;
