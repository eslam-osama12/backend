const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fsSync.existsSync(dirPath)) {
    fsSync.mkdirSync(dirPath, { recursive: true });
  }
};

// Delete old image file if it exists (async version)
const deleteOldImage = async (imagePath) => {
  if (!imagePath) return;

  try {
    await fs.access(imagePath);
    await fs.unlink(imagePath);
    console.log(`✅ Deleted old image: ${imagePath}`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`❌ Error deleting old image: ${imagePath}`, error.message);
    }
  }
};

// @desc    Resize and save category image
exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  // If this is an update operation, delete the old image first
  if (req.params.id) {
    const Category = require("../models/categoryModel");
    const oldCategory = await Category.findById(req.params.id);

    if (oldCategory && oldCategory.image) {
      await deleteOldImage(oldCategory.image);
    }
  }

  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  const uploadPath = path.join("uploads", "categories");

  ensureDirectoryExists(uploadPath);

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(uploadPath, filename));

  // Save image path to body
  req.body.image = `${uploadPath}/${filename}`;

  next();
});

// @desc    Resize and save brand image
exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  // If this is an update operation, delete the old image first
  if (req.params.id) {
    const Brand = require("../models/brandModel");
    const oldBrand = await Brand.findById(req.params.id);

    if (oldBrand && oldBrand.image) {
      await deleteOldImage(oldBrand.image);
    }
  }

  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  const uploadPath = path.join("uploads", "brands");

  ensureDirectoryExists(uploadPath);

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(uploadPath, filename));

  // Save image path to body
  req.body.image = `${uploadPath}/${filename}`;

  next();
});

// @desc    Resize and save product images
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // If this is an update operation, delete old images first
  if (req.params.id) {
    const Product = require("../models/productModel");
    const oldProduct = await Product.findById(req.params.id);

    if (oldProduct) {
      // Delete old cover image if a new one is being uploaded
      if (req.files.imageCover && oldProduct.imageCover) {
        await deleteOldImage(oldProduct.imageCover);
      }

      // Delete old images if new ones are being uploaded
      if (
        req.files.images &&
        oldProduct.images &&
        oldProduct.images.length > 0
      ) {
        await Promise.all(
          oldProduct.images.map((imagePath) => deleteOldImage(imagePath))
        );
      }
    }
  }

  // 1- Image cover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    const uploadPath = path.join("uploads", "products");

    ensureDirectoryExists(uploadPath);

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(path.join(uploadPath, imageCoverFileName));

    req.body.imageCover = `${uploadPath}/${imageCoverFileName}`;
  }

  // 2- Images
  if (req.files.images) {
    req.body.images = [];
    const uploadPath = path.join("uploads", "products");

    ensureDirectoryExists(uploadPath);

    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(path.join(uploadPath, imageName));

        req.body.images.push(`${uploadPath}/${imageName}`);
      })
    );
  }

  next();
});

// Export deleteOldImage for use in controllers
exports.deleteOldImage = deleteOldImage;

// @desc    Resize and save user profile image
exports.resizeUserProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  // Get the old profile image to delete later
  const User = require("../models/userModel");
  const oldUser = await User.findById(req.user._id);

  if (oldUser && oldUser.profileImg) {
    await deleteOldImage(oldUser.profileImg);
  }

  const filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  const uploadPath = path.join("uploads", "users");

  ensureDirectoryExists(uploadPath);

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(uploadPath, filename));

  // Save image path to body
  req.body.profileImg = `${uploadPath}/${filename}`;

  next();
});
