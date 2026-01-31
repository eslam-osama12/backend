const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utils/apiFeatures');
const Category = require('../models/categoryModel');
const AppError = require('../utils/appError');

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const documentsCount = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;

  res
    .status(200)
    .json({ results: categories.length, paginationResult, data: categories });
});

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new AppError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await Category.create({
    name,
    slug: slugify(name),
    image: req.body.image,
  });
  res.status(201).json({ data: category });
});

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    { name, slug: slugify(name), image: req.body.image },
    { new: true }
  );

  if (!category) {
    return next(new AppError(`No category for this id ${id}`, 404));
  }

  res.status(200).json({ data: category });
});

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    return next(new AppError(`No category for this id ${id}`, 404));
  }

  // Delete the image file if it exists
  if (category.image) {
    const fs = require('fs').promises;
    try {
      await fs.access(category.image);
      await fs.unlink(category.image);
      console.log(`✅ Deleted category image: ${category.image}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`❌ Error deleting category image: ${category.image}`, error.message);
      }
    }
  }

  await Category.findByIdAndDelete(id);
  res.status(204).send();
});
