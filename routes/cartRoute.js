const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../controllers/cartController");
const authService = require("../controllers/authController");
const {
  addProductToCartValidator,
  updateCartItemQuantityValidator,
  removeCartItemValidator,
  applyCouponValidator,
} = require("../utils/validators/cartValidator");

const router = express.Router();

router.use(
  authService.protect,
  authService.allowedTo("user", "admin", "manager"),
);

router
  .route("/")
  .post(addProductToCartValidator, addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.put("/applyCoupon", applyCouponValidator, applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantityValidator, updateCartItemQuantity)
  .delete(removeCartItemValidator, removeSpecificCartItem);

module.exports = router;
