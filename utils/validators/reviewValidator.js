const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Review = require('../../models/reviewModel');

exports.createReviewValidator = [
  check('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Review title cannot be empty or only whitespace')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Review title must be at least 3 characters')
    .bail()
    .isLength({ max: 200 })
    .withMessage('Review title must not exceed 200 characters'),

  check('ratings')
    .notEmpty()
    .withMessage('Rating is required')
    .bail()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be a number between 1 and 5'),

  check('product')
    .notEmpty()
    .withMessage('Product ID is required')
    .bail()
    .isMongoId()
    .withMessage('Invalid product ID format')
    .bail()
    .custom(async (value, { req }) => {
      // Check if product exists
      const Product = require('../../models/productModel');
      const product = await Product.findById(value);
      if (!product) {
        throw new Error('Product not found');
      }

      // Check if logged user already created a review for this product
      const review = await Review.findOne({
        user: req.user._id,
        product: value,
      });
      if (review) {
        throw new Error('You have already reviewed this product');
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateReviewValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid review ID format')
    .bail()
    .custom(async (value, { req }) => {
      // Check if review belongs to logged user
      const review = await Review.findById(value);
      if (!review) {
        throw new Error('Review not found');
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error('You can only update your own reviews');
      }
      return true;
    }),

  check('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Review title cannot be empty or only whitespace')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Review title must be at least 3 characters')
    .bail()
    .isLength({ max: 200 })
    .withMessage('Review title must not exceed 200 characters'),

  check('ratings')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be a number between 1 and 5'),

  validatorMiddleware,
];

exports.getReviewValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid review ID format'),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid review ID format')
    .custom(async (value, { req }) => {
      // Check if review belongs to logged user (for users) or allow admin/manager
      if (req.user.role === 'user') {
        const review = await Review.findById(value);
        if (!review) {
          throw new Error('Review not found');
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error('You can only delete your own reviews');
        }
      }
      return true;
    }),

  validatorMiddleware,
];
