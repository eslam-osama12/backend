const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc    Add address to user addresses list
// @route   POST /api/v1/addresses
// @access  Private/Protect
exports.addAddress = asyncHandler(async (req, res, next) => {
  // $addToSet => add address object to addresses array if not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address added successfully.",
    data: user.addresses,
  });
});

// @desc    Remove address from user addresses list
// @route   DELETE /api/v1/addresses/:addressId
// @access  Private/Protect
exports.removeAddress = asyncHandler(async (req, res, next) => {
  // $pull => remove address object from addresses array if exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully.",
    data: user.addresses,
  });
});

// @desc    Get logged user addresses list
// @route   GET /api/v1/addresses
// @access  Private/Protect
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});

// @desc    Update specific address
// @route   PUT /api/v1/addresses/:addressId
// @access  Private/Protect
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const { addressId } = req.params;
  const { alias, details, phone, city, postalCode } = req.body;

  // Find and update the specific address in the user's addresses array
  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id,
      "addresses._id": addressId,
    },
    {
      $set: {
        "addresses.$.alias": alias,
        "addresses.$.details": details,
        "addresses.$.phone": phone,
        "addresses.$.city": city,
        "addresses.$.postalCode": postalCode,
      },
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "Address not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Address updated successfully.",
    data: user.addresses,
  });
});
