const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createCashOrderValidator = [
  param('cartId')
    .isMongoId()
    .withMessage('Invalid cart ID format'),

  check('shippingAddress')
    .optional()
    .isObject()
    .withMessage('Shipping address must be an object'),

  check('shippingAddress.details')
    .optional()
    .notEmpty()
    .withMessage('Address details are required'),

  check('shippingAddress.phone')
    .optional()
    .notEmpty()
    .withMessage('Phone number is required'),

  check('shippingAddress.city')
    .optional()
    .notEmpty()
    .withMessage('City is required'),

  check('shippingAddress.postalCode')
    .optional()
    .notEmpty()
    .withMessage('Postal code is required'),

  validatorMiddleware,
];

exports.checkoutSessionValidator = [
  param('cartId')
    .isMongoId()
    .withMessage('Invalid cart ID format'),

  validatorMiddleware,
];

exports.getOrderValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),

  validatorMiddleware,
];

exports.updateOrderToPaidValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),

  validatorMiddleware,
];

exports.updateOrderToDeliveredValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),

  validatorMiddleware,
];
