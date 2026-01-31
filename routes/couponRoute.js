const express = require('express');
const {
  getCoupon,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/couponController');
const authService = require('../controllers/authController');
const {
  createCouponValidator,
  updateCouponValidator,
  getCouponValidator,
  deleteCouponValidator,
} = require('../utils/validators/couponValidator');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('admin', 'manager'));

router
  .route('/')
  .get(getCoupons)
  .post(createCouponValidator, createCoupon);
router
  .route('/:id')
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
