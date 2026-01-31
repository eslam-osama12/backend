const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const documentsCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search("Products")
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const products = await mongooseQuery;

  res
    .status(200)
    .json({ results: products.length, paginationResult, data: products });
});

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("reviews");
  if (!product) {
    return next(new AppError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!product) {
    return next(new AppError(`No product for this id ${id}`, 404));
  }

  res.status(200).json({ data: product });
});

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(new AppError(`No product for this id ${id}`, 404));
  }

  const fs = require("fs").promises;

  console.log("🗑️ Deleting product:", product._id);
  console.log("📸 Cover image path:", product.imageCover);
  console.log("📸 Images paths:", product.images);

  // Delete cover image if it exists
  if (product.imageCover) {
    try {
      await fs.access(product.imageCover);
      await fs.unlink(product.imageCover);
      console.log("✅ Deleted cover image:", product.imageCover);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error(
          "❌ Error deleting cover image:",
          product.imageCover,
          error.message
        );
      } else {
        console.log("❌ Cover image not found on disk:", product.imageCover);
      }
    }
  }

  // Delete all product images if they exist
  if (product.images && product.images.length > 0) {
    await Promise.all(
      product.images.map(async (imagePath) => {
        try {
          await fs.access(imagePath);
          await fs.unlink(imagePath);
          console.log("✅ Deleted image:", imagePath);
        } catch (error) {
          if (error.code !== "ENOENT") {
            console.error("❌ Error deleting image:", imagePath, error.message);
          } else {
            console.log("❌ Image not found on disk:", imagePath);
          }
        }
      })
    );
  }

  await Product.findByIdAndDelete(id);
  console.log("✅ Product deleted from database");
  res.status(204).send();
});
