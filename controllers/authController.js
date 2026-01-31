const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const { sendEmail, emailTemplates } = require("../utils/sendEmail");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

const sendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email", 404));
  }

  // 2) Generate random reset code (6 digits)
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // 3) Save hashed reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save({ validateBeforeSave: false });

  // 4) Send reset code via email
  try {
    const emailContent = emailTemplates.passwordReset(user.name, resetCode);
    await sendEmail({
      email: user.email,
      subject: emailContent.subject,
      message: emailContent.message,
      html: emailContent.html,
    });

    res.status(200).json({
      status: "success",
      message: "Reset code sent to your email!",
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("Failed to send email. Please try again later.", 500),
    );
  }
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Reset code invalid or expired", 400));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
  });
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email", 404));
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new AppError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  // 3) If everything ok, send token to client
  sendToken(user, 200, res);
});

// @desc    Signup
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user (unverified)
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    isEmailVerified: false,
  });

  // 2- Generate 6-digit verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
  const hashedVerificationCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");

  // 3- Save verification code to database
  user.emailVerificationCode = hashedVerificationCode;
  user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  // 4- Send verification email
  try {
    const emailContent = emailTemplates.emailVerification(
      user.name,
      verificationCode,
    );
    await sendEmail({
      email: user.email,
      subject: emailContent.subject,
      message: emailContent.message,
      html: emailContent.html,
    });

    res.status(201).json({
      status: "success",
      message:
        "Signup successful! Please check your email to verify your account.",
    });
  } catch (error) {
    // If email fails, delete the user
    await User.findByIdAndDelete(user._id);
    return next(
      new AppError("Failed to send verification email. Please try again.", 500),
    );
  }
});

// @desc    Verify Email
// @route   POST /api/v1/auth/verifyEmail
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // 1) Hash the verification code from request
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.verificationCode)
    .digest("hex");

  // 2) Find user with valid verification code
  const user = await User.findOne({
    email: req.body.email,
    emailVerificationCode: hashedCode,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired verification code", 400));
  }

  // 3) Mark email as verified
  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // 4) Generate token for immediate login
  sendToken(user, 200, res);
});

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) Check if email is verified
  if (!user.isEmailVerified) {
    return next(
      new AppError(
        "Please verify your email before logging in. Check your inbox for the verification code.",
        401,
      ),
    );
  }

  // 4) generate token & send response
  sendToken(user, 200, res);
});

// @desc    Google Login
// @route   POST /api/v1/auth/googleLogin
// @access  Public
exports.googleLogin = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new AppError("ID Token is required", 400));
  }

  // 1) Verify Google Token
  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    console.error("Google verifyIdToken error:", err);
    return next(new AppError(`Invalid Google token: ${err.message}`, 401));
  }

  const { sub: googleId, email, name, picture } = payload;

  // 2) Check if user exists by googleId OR email
  let user = await User.findOne({
    $or: [{ googleId }, { email }],
  });

  if (user) {
    // Update googleId if not present (user registered with email earlier)
    if (!user.googleId) {
      user.googleId = googleId;
      // Auto verify email since Google verified it
      user.isEmailVerified = true;
      await user.save({ validateBeforeSave: false });
    }
  } else {
    // 3) Create new user if not exists
    user = await User.create({
      name,
      email,
      googleId,
      profileImg: picture,
      isEmailVerified: true, // Google verified emails are trusted
    });
  }

  // 4) generate token & send response
  sendToken(user, 200, res);
});

// @desc    Logout
// @route   GET /api/v1/auth/logout
// @access  Public
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// @desc    Protect
// @route   GET /api/v1/auth/protect
// @access  Public
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError(
        "You are not login, Please login to get access this route",
        401,
      ),
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new AppError(
        "The user that belong to this token does no longer exist",
        401,
      ),
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new AppError(
          "User recently changed his password. please login again..",
          401,
        ),
      );
    }
  }

  req.user = currentUser;
  next();
});

// @desc    Authorization (User Permissions)
// ["admin", "manager"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Your role '${req.user.role}' is not authorized. Required roles: ${roles.join(", ")}`,
          403,
        ),
      );
    }
    next();
  });
