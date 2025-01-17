import express from 'express';
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getApplicableCoupons,
  applyCoupon
} from '../controllers/coupon.controller.js';

const router = express.Router();

// CRUD operations
router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.get('/:id', getCouponById);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

// Coupon application endpoints
router.post('/applicable-coupons', getApplicableCoupons);
router.post('/apply-coupon/:id', applyCoupon);

export default router;
