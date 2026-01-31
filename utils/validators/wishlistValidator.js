const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Product = require('../../models/productModel');

exports.addProductToWishlistValidator = [
  check('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format')
    .custom(async (value) => {
      const product = await Product.findById(value);
      if (!product) {
        throw new Error('Product not found');
      }
      return true;
    }),

  validatorMiddleware,
];

exports.removeProductFromWishlistValidator = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID format'),

  validatorMiddleware,
];
