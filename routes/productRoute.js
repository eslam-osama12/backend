const express = require('express');
const {
  getProduct,
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authService = require('../controllers/authController');
const reviewsRoute = require('./reviewRoute');
const {
  createProductValidator,
  updateProductValidator,
  getProductValidator,
  deleteProductValidator,
} = require('../utils/validators/productValidator');
const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');
const { resizeProductImages } = require('../middlewares/resizeImageMiddleware');

const router = express.Router();

// POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3
router.use('/:productId/reviews', reviewsRoute);

router
  .route('/')
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadMixOfImages([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadMixOfImages([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
