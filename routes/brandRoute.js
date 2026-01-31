const express = require('express');
const {
  getBrand,
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandController');
const authService = require('../controllers/authController');
const {
  createBrandValidator,
  updateBrandValidator,
  getBrandValidator,
  deleteBrandValidator,
} = require('../utils/validators/brandValidator');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const { resizeBrandImage } = require('../middlewares/resizeImageMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadSingleImage('image'),
    resizeBrandImage,
    createBrandValidator,
    createBrand
  );
router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadSingleImage('image'),
    resizeBrandImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
