const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Brand = require('../../models/brandModel');

exports.createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ min: 3 })
    .withMessage('Brand name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage('Brand name must not exceed 32 characters')
    .custom(async (value) => {
      const brand = await Brand.findOne({ name: value });
      if (brand) {
        throw new Error('Brand name already exists');
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateBrandValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid brand ID format'),

  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Brand name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage('Brand name must not exceed 32 characters')
    .custom(async (value, { req }) => {
      // Check if name already exists for a different brand
      const brand = await Brand.findOne({ name: value });
      if (brand && brand._id.toString() !== req.params.id) {
        throw new Error('Brand name already exists');
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getBrandValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid brand ID format'),

  validatorMiddleware,
];

exports.deleteBrandValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid brand ID format'),

  validatorMiddleware,
];
