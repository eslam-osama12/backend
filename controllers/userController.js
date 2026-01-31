const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiFeatures = require("../utils/apiFeatures");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const documentsCount = await User.countDocuments();
  const apiFeatures = new ApiFeatures(User.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search("User")
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const users = await mongooseQuery;

  res
    .status(200)
    .json({ results: users.length, paginationResult, data: users });
});

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError(`No user for this id ${id}`, 404));
  }
  res.status(200).json({ data: user });
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    phone: req.body.phone,
    profileImg: req.body.profileImg,
  });
  res.status(201).json({ data: user });
});

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role,
      active: req.body.active,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await User.findByIdAndDelete(id);

  if (!document) {
    return next(new AppError(`No document for this id ${id}`, 404));
  }
  res.status(204).send();
});

// @desc    Update user password
// @route   PUT /api/v1/users/changePassword/:id
// @access  Private/Admin
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // Hashing password
  req.body.password = await bcrypt.hash(req.body.password, 12);

  const user = await User.findByIdAndUpdate(
    id,
    {
      password: req.body.password,
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!user) {
    return next(new AppError(`No user for this id ${id}`, 404));
  }
  res.status(200).json({ data: user });
});

// @desc    Get logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/changeMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user from DB
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // 2) Check if current password is correct
  const isCorrectPassword = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );
  if (!isCorrectPassword) {
    return next(new AppError("Incorrect current password", 401));
  }

  // 3) Update password
  user.password = req.body.password;
  user.passwordChangedAt = Date.now();
  await user.save();

  // 4) Generate token
  // const token = createToken(user._id);

  res.status(200).json({ data: user });
});

// @desc    Update logged user data (name, email)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "success" });
});

// @desc    Update logged user profile image
// @route   PUT /api/v1/users/updateProfileImage
// @access  Private/Protect
exports.updateProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.body.profileImg) {
    return next(new AppError("No image provided", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { profileImg: req.body.profileImg },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

// @desc    Delete logged user profile image
// @route   DELETE /api/v1/users/deleteProfileImage
// @access  Private/Protect
exports.deleteProfileImage = asyncHandler(async (req, res, next) => {
  const { deleteOldImage } = require("../middlewares/resizeImageMiddleware");

  // Get current user to find old image
  const user = await User.findById(req.user._id);

  // Delete the old image file if it exists
  if (user && user.profileImg) {
    await deleteOldImage(user.profileImg);
  }

  // Remove profileImg from user
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { profileImg: 1 } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Profile image deleted successfully",
    data: updatedUser,
  });
});
