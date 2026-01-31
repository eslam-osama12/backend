const express = require("express");
const {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  googleLogin,
} = require("../controllers/authController");
const {
  signupValidator,
  loginValidator,
  verifyEmailValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.get("/logout", logout);
router.post("/verifyEmail", verifyEmailValidator, verifyEmail);
router.post("/forgotPassword", forgotPasswordValidator, forgotPassword);
router.post("/verifyResetCode", verifyResetCodeValidator, verifyPassResetCode);
router.put("/resetPassword", resetPasswordValidator, resetPassword);
router.post("/googleLogin", googleLogin);

module.exports = router;
