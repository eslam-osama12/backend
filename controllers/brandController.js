const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utils/apiFeatures');
const Brand = require('../models/brandModel');
const AppError = require('../utils/appError');

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
  const documentsCount = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const brands = await mongooseQuery;

  res
    .status(200)
    .json({ results: brands.length, paginationResult, data: brands });
});

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new AppError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc    Create brand
// @route   POST /api/v1/brands
// @access  Private/Admin
exports.createBrand = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const brand = await Brand.create({
    name,
    slug: slugify(name),
    image: req.body.image,
  });
  res.status(201).json({ data: brand });
});

// @desc    Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private/Admin
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    id,
    { name, slug: slugify(name), image: req.body.image },
    { new: true }
  );

  if (!brand) {
    return next(new AppError(`No brand for this id ${id}`, 404));
  }

  res.status(200).json({ data: brand });
});

// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private/Admin
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  if (!brand) {
    return next(new AppError(`No brand for this id ${id}`, 404));
  }

  // Delete the image file if it exists
  if (brand.image) {
    const fs = require('fs').promises;
    try {
      await fs.access(brand.image);
      await fs.unlink(brand.image);
      console.log(`✅ Deleted brand image: ${brand.image}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`❌ Error deleting brand image: ${brand.image}`, error.message);
      }
    }
  }

  await Brand.findByIdAndDelete(id);
  res.status(204).send();
});
