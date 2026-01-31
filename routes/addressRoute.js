const express = require("express");
const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
  updateAddress,
} = require("../controllers/addressController");
const authService = require("../controllers/authController");
const {
  addAddressValidator,
  removeAddressValidator,
  updateAddressValidator,
} = require("../utils/validators/addressValidator");

const router = express.Router();

router.use(
  authService.protect,
  authService.allowedTo("user", "admin", "manager"),
);

router
  .route("/")
  .post(addAddressValidator, addAddress)
  .get(getLoggedUserAddresses);
router
  .route("/:addressId")
  .put(updateAddressValidator, updateAddress)
  .delete(removeAddressValidator, removeAddress);

module.exports = router;
