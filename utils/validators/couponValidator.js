const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createCouponValidator = [
  check('name')
    .notEmpty()
    .withMessage('Coupon name is required')
    .toUpperCase(),

  check('expire')
    .notEmpty()
    .withMessage('Coupon expiration date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Expiration date must be in the future');
      }
      return true;
    }),

  check('discount')
    .notEmpty()
    .withMessage('Discount value is required')
    .isNumeric()
    .withMessage('Discount must be a number')
    .isFloat({ min: 1, max: 100 })
    .withMessage('Discount must be between 1 and 100'),

  validatorMiddleware,
];

exports.updateCouponValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid coupon ID format'),

  check('name')
    .optional()
    .toUpperCase(),

  check('expire')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Expiration date must be in the future');
      }
      return true;
    }),

  check('discount')
    .optional()
    .isNumeric()
    .withMessage('Discount must be a number')
    .isFloat({ min: 1, max: 100 })
    .withMessage('Discount must be between 1 and 100'),

  validatorMiddleware,
];

exports.getCouponValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid coupon ID format'),

  validatorMiddleware,
];

exports.deleteCouponValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid coupon ID format'),

  validatorMiddleware,
];
