const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ApiFeatures = require("../utils/apiFeatures");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");

// @desc    Create cash order
// @route   POST /api/v1/orders/:cartId
// @access  Private/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new AppError(`There is no such cart with id ${req.params.cartId}`, 404),
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + 0; // taxPrice + shippingPrice

  // 3) Create order with default paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption);

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "success", data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Private/User-Admin-Manager
exports.findAllOrders = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
  }

  const documentsCount = await Order.countDocuments();
  const apiFeatures = new ApiFeatures(Order.find(filter), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;
  const orders = await mongooseQuery;

  res
    .status(200)
    .json({ results: orders.length, paginationResult, data: orders });
});

// @desc    Get all orders
// @route   POST /api/v1/orders/:id
// @access  Private/User-Admin-Manager
exports.findSpecificOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new AppError(`There is no order with id ${req.params.id}`, 404),
    );
  }

  res.status(200).json({ status: "success", data: order });
});

// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new AppError(`There is no order with id ${req.params.id}`, 404),
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = "processing";

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new AppError(`There is no order with id ${req.params.id}`, 404),
    );
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = "delivered";

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc    Get checkout session from stripe
// @route   GET /api/v1/orders/checkout-session/:cartId
// @access  Private/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId).populate(
    "cartItems.product",
  );
  if (!cart) {
    return next(
      new AppError(`There is no such cart with id ${req.params.cartId}`, 404),
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = Math.round(cartPrice * 100); // Stripe expects amount in cents as integer

  // 3) Create stripe checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${req.protocol}://${req
        .get("host")
        .replace(
          "8000",
          "5173",
        )}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req
        .get("host")
        .replace("8000", "5173")}/payment-cancel`,
      customer_email: req.user.email,
      client_reference_id: req.params.cartId,
      metadata: {
        shippingDetails: req.body.shippingAddress?.details || "",
        shippingCity: req.body.shippingAddress?.city || "",
        shippingPhone: req.body.shippingAddress?.phone || "",
        shippingPostalCode: req.body.shippingAddress?.postalCode || "",
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: totalOrderPrice,
            product_data: {
              name: `Order from ${req.user.name}`,
              description: `Cart contains ${cart.cartItems.length} item(s)`,
            },
          },
          quantity: 1,
        },
      ],
    });

    // 4) Send session to response
    res.status(200).json({ status: "success", session });
  } catch (error) {
    console.error("Stripe Session Creation Error:", error);
    return next(new AppError("Failed to create checkout session", 500));
  }
});

// @desc    Update order shipping address (by user, only for pending orders)
// @route   PUT /api/v1/orders/:id
// @access  Private/User
exports.updateOrderShippingAddress = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new AppError(`There is no order with id ${req.params.id}`, 404),
    );
  }

  // Check if order belongs to logged user
  if (order.user._id.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to update this order", 403),
    );
  }

  // Only allow update if order is not yet delivered or paid
  if (order.isDelivered) {
    return next(new AppError("Cannot update a delivered order", 400));
  }

  // Update shipping address
  order.shippingAddress = {
    details:
      req.body.shippingAddress?.details || order.shippingAddress?.details,
    phone: req.body.shippingAddress?.phone || order.shippingAddress?.phone,
    city: req.body.shippingAddress?.city || order.shippingAddress?.city,
    postalCode:
      req.body.shippingAddress?.postalCode || order.shippingAddress?.postalCode,
  };

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

// @desc    Cancel order (by user, only for pending orders)
// @route   DELETE /api/v1/orders/:id
// @access  Private/User
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new AppError(`There is no order with id ${req.params.id}`, 404),
    );
  }

  // Check if order belongs to logged user
  if (order.user._id.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to cancel this order", 403),
    );
  }

  // Only allow cancel if order is not yet delivered
  if (order.isDelivered) {
    return next(new AppError("Cannot cancel a delivered order", 400));
  }

  // If order was paid, we might need to handle refund logic here
  // For now, just delete the order

  // Restore product quantities
  const bulkOption = order.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: +item.quantity, sold: -item.quantity } },
    },
  }));
  await Product.bulkWrite(bulkOption);

  await Order.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Order cancelled successfully",
  });
});

// Helper function to create order after Stripe payment
const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  if (!cart) return;

  // Create order with card payment
  const order = await Order.create({
    user: cart.user,
    cartItems: cart.cartItems,
    totalOrderPrice: orderPrice,
    shippingAddress: {
      details: session.metadata.shippingDetails,
      city: session.metadata.shippingCity,
      phone: session.metadata.shippingPhone,
      postalCode: session.metadata.shippingPostalCode,
    },
    paymentMethodType: "card",
    isPaid: true,
    paidAt: Date.now(),
    status: "processing",
  });

  // Update product quantities
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption);

    // Clear cart
    await Cart.findByIdAndDelete(cartId);
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/v1/orders/webhook-checkout
// @access  Public
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    await createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
});
