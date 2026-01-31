const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Category = require('../../models/categoryModel');
const Brand = require('../../models/brandModel');

exports.createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage('Product title is required')
    .isLength({ min: 3 })
    .withMessage('Product title must be at least 3 characters')
    .isLength({ max: 100 })
    .withMessage('Product title must not exceed 100 characters'),

  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 20 })
    .withMessage('Product description must be at least 20 characters'),

  check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isNumeric()
    .withMessage('Product quantity must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Product quantity must be a positive number');
      }
      return true;
    }),

  check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price must be a number')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Product price must be greater than 0');
      }
      if (value > 200000) {
        throw new Error('Product price must not exceed 200000');
      }
      return true;
    }),

  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Price after discount must be a number')
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error('Price after discount must be lower than original price');
      }
      return true;
    }),

  check('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array'),

  check('imageCover')
    .notEmpty()
    .withMessage('Product image cover is required'),

  check('images')
    .optional()
    .isArray()
    .withMessage('Product images must be an array'),

  check('category')
    .notEmpty()
    .withMessage('Product category is required')
    .isMongoId()
    .withMessage('Invalid category ID format')
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error('Category not found');
      }
      return true;
    }),

  check('brand')
    .optional()
    .isMongoId()
    .withMessage('Invalid brand ID format')
    .custom(async (value) => {
      if (value) {
        const brand = await Brand.findById(value);
        if (!brand) {
          throw new Error('Brand not found');
        }
      }
      return true;
    }),

  check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('Ratings average must be a number')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings average must be between 1 and 5'),

  validatorMiddleware,
];

exports.updateProductValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID format'),

  check('title')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Product title must be at least 3 characters')
    .isLength({ max: 100 })
    .withMessage('Product title must not exceed 100 characters'),

  check('description')
    .optional()
    .isLength({ min: 20 })
    .withMessage('Product description must be at least 20 characters'),

  check('quantity')
    .optional()
    .isNumeric()
    .withMessage('Product quantity must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Product quantity must be a positive number');
      }
      return true;
    }),

  check('price')
    .optional()
    .isNumeric()
    .withMessage('Product price must be a number')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Product price must be greater than 0');
      }
      if (value > 200000) {
        throw new Error('Product price must not exceed 200000');
      }
      return true;
    }),

  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Price after discount must be a number'),

  check('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array'),

  check('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID format'),

  check('brand')
    .optional()
    .isMongoId()
    .withMessage('Invalid brand ID format'),

  validatorMiddleware,
];

exports.getProductValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID format'),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID format'),

  validatorMiddleware,
];
