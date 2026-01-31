const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utils/apiFeatures');
const Coupon = require('../models/couponModel');
const AppError = require('../utils/appError');

// @desc    Get list of coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
exports.getCoupons = asyncHandler(async (req, res) => {
  const documentsCount = await Coupon.countDocuments();
  const apiFeatures = new ApiFeatures(Coupon.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;
  const coupons = await mongooseQuery;

  res
    .status(200)
    .json({ results: coupons.length, paginationResult, data: coupons });
});

// @desc    Get specific coupon by id
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
exports.getCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return next(new AppError(`No coupon for this id ${id}`, 404));
  }
  res.status(200).json({ data: coupon });
});

// @desc    Create coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin
exports.createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ data: coupon });
});

// @desc    Update specific coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!coupon) {
    return next(new AppError(`No coupon for this id ${id}`, 404));
  }
  res.status(200).json({ data: coupon });
});

// @desc    Delete specific coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) {
    return next(new AppError(`No coupon for this id ${id}`, 404));
  }
  res.status(204).send();
});
