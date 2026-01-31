const xss = require('xss-clean/lib/xss');

const xssCleanMiddleware = () => (req, res, next) => {
  if (req.body) {
    req.body = xss.clean(req.body);
  }
  if (req.query) {
    // req.query is a getter in Express 5, so we must mutate the object properties instead of reassigning it
    const cleanedQuery = xss.clean(req.query);
    for (const key in cleanedQuery) {
      req.query[key] = cleanedQuery[key];
    }
  }
  if (req.params) {
    req.params = xss.clean(req.params);
  }
  next();
};

module.exports = xssCleanMiddleware;
