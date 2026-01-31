const express = require("express");
const { getDashboardStats } = require("../controllers/dashboardController");
const authService = require("../controllers/authController");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("admin", "manager"));

router.get("/stats", getDashboardStats);

module.exports = router;
