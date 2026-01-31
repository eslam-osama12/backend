const mongoSanitize = require('express-mongo-sanitize');

const mongoSanitizeMiddleware = () => (req, res, next) => {
  if (req.body) {
    mongoSanitize.sanitize(req.body);
  }
  if (req.query) {
    mongoSanitize.sanitize(req.query);
  }
  if (req.params) {
    mongoSanitize.sanitize(req.params);
  }
  next();
};

module.exports = mongoSanitizeMiddleware;
