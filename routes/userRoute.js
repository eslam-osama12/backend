const express = require("express");
const {
  getUser,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  updateProfileImage,
  deleteProfileImage,
} = require("../controllers/userController");

const authService = require("../controllers/authController");
const {
  createUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserPasswordValidator,
  updateLoggedUserDataValidator,
  getUserValidator,
  deleteUserValidator,
} = require("../utils/validators/userValidator");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const {
  resizeUserProfileImage,
} = require("../middlewares/resizeImageMiddleware");

const router = express.Router();

router.use(authService.protect);

router.get("/getMe", getLoggedUserData, getUser);
router.put(
  "/changeMyPassword",
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword
);
router.put("/updateMe", updateLoggedUserDataValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

// Profile image routes
router.put(
  "/updateProfileImage",
  uploadSingleImage("image"),
  resizeUserProfileImage,
  updateProfileImage
);
router.delete("/deleteProfileImage", deleteProfileImage);

// Admin
router.use(authService.allowedTo("admin"));

router
  .route("/changePassword/:id")
  .put(changeUserPasswordValidator, changeUserPassword);

router.route("/").get(getUsers).post(createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
