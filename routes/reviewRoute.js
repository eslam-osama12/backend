const express = require("express");
const {
  getReview,
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  setProductAndUserToBody,
} = require("../controllers/reviewController");
const authService = require("../controllers/authController");
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user", "admin", "manager"),
    setProductAndUserToBody,
    createReviewValidator,
    createReview,
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authService.protect,
    authService.allowedTo("user", "admin", "manager"),
    updateReviewValidator,
    updateReview,
  )
  .delete(
    authService.protect,
    authService.allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview,
  );

module.exports = router;
