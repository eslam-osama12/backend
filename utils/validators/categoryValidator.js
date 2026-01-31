const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Category = require('../../models/categoryModel');

exports.createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3 })
    .withMessage('Category name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage('Category name must not exceed 32 characters')
    .custom(async (value) => {
      const category = await Category.findOne({ name: value });
      if (category) {
        throw new Error('Category name already exists');
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateCategoryValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid category ID format'),

  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Category name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage('Category name must not exceed 32 characters')
    .custom(async (value, { req }) => {
      // Check if name already exists for a different category
      const category = await Category.findOne({ name: value });
      if (category && category._id.toString() !== req.params.id) {
        throw new Error('Category name already exists');
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getCategoryValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid category ID format'),

  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid category ID format'),

  validatorMiddleware,
];
