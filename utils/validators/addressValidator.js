const { check, param } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.addAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Address alias is required")
    .isString()
    .withMessage("Alias must be a string"),

  check("details")
    .notEmpty()
    .withMessage("Address details are required")
    .isString()
    .withMessage("Details must be a string"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number format"),

  check("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),

  check("postalCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .isString()
    .withMessage("Postal code must be a string"),

  validatorMiddleware,
];

exports.removeAddressValidator = [
  param("addressId").notEmpty().withMessage("Address ID is required"),

  validatorMiddleware,
];

exports.updateAddressValidator = [
  param("addressId").notEmpty().withMessage("Address ID is required"),
  check("alias").optional().isString().withMessage("Alias must be a string"),
  check("details")
    .optional()
    .isString()
    .withMessage("Details must be a string"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number format"),
  check("city").optional().isString().withMessage("City must be a string"),
  check("postalCode")
    .optional()
    .isString()
    .withMessage("Postal code must be a string"),
  validatorMiddleware,
];
