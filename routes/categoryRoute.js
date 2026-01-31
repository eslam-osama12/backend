const express = require('express');
const {
  getCategory,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const authService = require('../controllers/authController');
const {
  createCategoryValidator,
  updateCategoryValidator,
  getCategoryValidator,
  deleteCategoryValidator,
} = require('../utils/validators/categoryValidator');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const { resizeCategoryImage } = require('../middlewares/resizeImageMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadSingleImage('image'),
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  );
router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadSingleImage('image'),
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
