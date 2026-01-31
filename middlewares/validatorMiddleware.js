const { validationResult } = require("express-validator");

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((error) => error.msg)
      .join(". ");
    return res.status(400).json({ status: "fail", message });
  }
  next();
};

module.exports = validatorMiddleware;
