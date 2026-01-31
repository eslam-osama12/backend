const { check, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email already exists');
      }
      return true;
    }),

  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  check('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number format'),

  validatorMiddleware,
];

exports.updateUserValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format'),

  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user && user._id.toString() !== req.params.id) {
        throw new Error('Email already exists');
      }
      return true;
    }),

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number format'),

  check('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format'),

  check('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required'),

  check('password')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirm) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateLoggedUserPasswordValidator = [
  check('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required'),

  check('password')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirm) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateLoggedUserDataValidator = [
  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),

  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user && user._id.toString() !== req.user._id.toString()) {
        throw new Error('Email already exists');
      }
      return true;
    }),

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number format'),

  validatorMiddleware,
];

exports.getUserValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format'),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format'),

  validatorMiddleware,
];
