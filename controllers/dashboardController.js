const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// @desc    Get dashboard stats
// @route   GET /api/v1/dashboard/stats
// @access  Private/Admin-Manager
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const [ordersCount, productsCount, usersCount, totalRevenue] =
    await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: "$totalOrderPrice" } } },
      ]),
    ]);

  const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

  // Get recent orders
  const recentOrders = await Order.find()
    .limit(5)
    .sort("-createdAt")
    .populate("user", "name email");

  // Get sales by status
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  // Get sales trend (last 6 months)
  const salesTrend = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        revenue: { $sum: "$totalOrderPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats: {
        ordersCount,
        productsCount,
        usersCount,
        totalRevenue: revenue,
      },
      recentOrders,
      ordersByStatus,
      salesTrend,
    },
  });
});
