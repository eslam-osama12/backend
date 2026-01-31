const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Product = require('../../models/productModel');
const Cart = require('../../models/cartModel');

exports.addProductToCartValidator = [
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

  check('color')
    .optional()
    .isString()
    .withMessage('Color must be a string'),

  validatorMiddleware,
];

exports.updateCartItemQuantityValidator = [
  param('itemId')
    .isMongoId()
    .withMessage('Invalid cart item ID format'),

  check('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),

  validatorMiddleware,
];

exports.removeCartItemValidator = [
  param('itemId')
    .isMongoId()
    .withMessage('Invalid cart item ID format')
    .custom(async (val, { req }) => {
      // 1) Get Cart for logged user
      const cart = await Cart.findOne({ user: req.user._id });

      // 2) Check if cart exists and item exists in cart
      if (!cart) {
        throw new Error(`There is no cart for this user`);
      }

      const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === val
      );

      if (itemIndex === -1) {
        throw new Error(`There is no item for this id: ${val}`);
      }
      return true;
    }),

  validatorMiddleware,
];

exports.applyCouponValidator = [
  check('coupon')
    .notEmpty()
    .withMessage('Coupon name is required')
    .isString()
    .withMessage('Coupon must be a string'),

  validatorMiddleware,
];
