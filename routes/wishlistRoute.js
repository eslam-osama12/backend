const express = require("express");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../controllers/wishlistController");
const authService = require("../controllers/authController");
const {
  addProductToWishlistValidator,
  removeProductFromWishlistValidator,
} = require("../utils/validators/wishlistValidator");

const router = express.Router();

router.use(
  authService.protect,
  authService.allowedTo("user", "admin", "manager"),
);

router
  .route("/")
  .post(addProductToWishlistValidator, addProductToWishlist)
  .get(getLoggedUserWishlist);
router.delete(
  "/:productId",
  removeProductFromWishlistValidator,
  removeProductFromWishlist,
);

module.exports = router;
