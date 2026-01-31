const { check } = require('express-validator');
const dns = require('dns').promises;
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.signupValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters'),

  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (value) => {
      // Check if email domain has valid MX records
      const domain = value.split('@')[1];
      try {
        const mxRecords = await dns.resolveMx(domain);
        if (!mxRecords || mxRecords.length === 0) {
          throw new Error('Email domain does not exist or cannot receive emails');
        }
      } catch (error) {
        throw new Error('Email domain does not exist or cannot receive emails');
      }
      
      // Check if email already exists in database
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

  validatorMiddleware,
];

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  check('password')
    .notEmpty()
    .withMessage('Password is required'),

  validatorMiddleware,
];

exports.verifyEmailValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  check('verificationCode')
    .notEmpty()
    .withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Verification code must be exactly 6 digits')
    .isNumeric()
    .withMessage('Verification code must contain only numbers'),

  validatorMiddleware,
];

exports.forgotPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  validatorMiddleware,
];

exports.verifyResetCodeValidator = [
  check('resetCode')
    .notEmpty()
    .withMessage('Reset code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Reset code must be exactly 6 digits')
    .isNumeric()
    .withMessage('Reset code must contain only numbers'),

  validatorMiddleware,
];

exports.resetPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  check('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),

  validatorMiddleware,
];
