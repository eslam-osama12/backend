const express = require("express");
const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
  updateOrderShippingAddress,
  cancelOrder,
} = require("../controllers/orderController");
const authService = require("../controllers/authController");
const {
  createCashOrderValidator,
  checkoutSessionValidator,
  getOrderValidator,
  updateOrderToPaidValidator,
  updateOrderToDeliveredValidator,
} = require("../utils/validators/orderValidator");

const router = express.Router();

router.use(authService.protect);

router.post(
  "/checkout-session/:cartId",
  authService.allowedTo("user", "admin", "manager"),
  checkoutSessionValidator,
  checkoutSession,
);

router
  .route("/:cartId")
  .post(
    authService.allowedTo("user", "admin", "manager"),
    createCashOrderValidator,
    createCashOrder,
  );

router
  .route("/")
  .get(
    authService.allowedTo("user", "admin", "manager"),
    filterOrderForLoggedUser,
    findAllOrders,
  );

router
  .route("/:id")
  .get(getOrderValidator, findSpecificOrder)
  .put(
    authService.allowedTo("user", "admin", "manager"),
    updateOrderShippingAddress,
  )
  .delete(authService.allowedTo("user", "admin", "manager"), cancelOrder);

router.put(
  "/:id/pay",
  authService.allowedTo("admin", "manager"),
  updateOrderToPaidValidator,
  updateOrderToPaid,
);
router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "manager"),
  updateOrderToDeliveredValidator,
  updateOrderToDelivered,
);

module.exports = router;
