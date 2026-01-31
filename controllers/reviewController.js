const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");
const Review = require("../models/reviewModel");
const AppError = require("../utils/appError");

// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };

  const documentsCount = await Review.countDocuments();
  const apiFeatures = new ApiFeatures(Review.find(filter), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const reviews = await mongooseQuery;

  res
    .status(200)
    .json({ results: reviews.length, paginationResult, data: reviews });
});

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) {
    return next(new AppError(`No review for this id ${id}`, 404));
  }
  res.status(200).json({ data: review });
});

exports.setProductAndUserToBody = (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc    Create review
// @route   POST /api/v1/reviews
// @access  Private/Protect/User
exports.createReview = asyncHandler(async (req, res, next) => {
  const review = await Review.create(req.body);
  res.status(201).json({ data: review });
});

// @desc    Update specific review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Protect/User
exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError(`No review for this id ${req.params.id}`, 404));
  }

  review.title = req.body.title;
  review.ratings = req.body.ratings;

  await review.save();
  res.status(200).json({ data: review });
});

// @desc    Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/User-Admin-Manager
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id);

  if (!review) {
    return next(new AppError(`No review for this id ${id}`, 404));
  }
  // Trigger remove event to update ratings on product
  await review.deleteOne();
  res.status(204).send();
});
