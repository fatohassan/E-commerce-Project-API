import express from 'express';
import { createCoupon, deleteCoupon, getAllCoupon, getSingleCoupon, updateCoupon } from '../controllers/couponController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';
const couponRouter = express.Router();

couponRouter.post('/', isLoggedIn, isAdmin, createCoupon);
couponRouter.get('/:id', isLoggedIn, isAdmin, getSingleCoupon);
couponRouter.put('/:id', isLoggedIn, isAdmin, updateCoupon);
couponRouter.delete('/:id', isLoggedIn, isAdmin, deleteCoupon);
couponRouter.get('/', getAllCoupon);

export default couponRouter;