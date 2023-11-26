import asyncHandler from 'express-async-handler';
import Coupon from '../model/Coupon.js';

// @desc create Coupon
// @route POST /api/v1/coupon
// @access Private/admin
export const createCoupon = asyncHandler(async(req, res) => {
    // payload
    const {code, startDate, endDate, discount} = req.body;
    // check if there is a coupon
    const couponExist = await Coupon.findOne({code});
    if (couponExist) {
        throw new Error("Coupon already exist")
    }
    // check if discount is a number
    if (isNaN(discount)) {
        throw new Error ("Disount must be a number")
    }
    // creare the coupon
    const coupon = await Coupon.create({
        code: code?.toUpperCase(), 
        startDate, 
        endDate, 
        discount,
        user: req.userAuthId,
    });
    res.json({
        success: true,
        message: "Coupon created successfully",
        coupon,
    });
})

// @desc Get all Coupon
// @route GET /api/v1/coupon
// @access Public
export const getAllCoupon = asyncHandler(async(req, res) => {
    const coupon = await Coupon.find();
    res.json({
        success: true,
        message: "Coupons Fetched",
        coupon,
    });
})
// @desc Get single Coupon
// @route GET /api/v1/coupon/:id
// @access Private/Admin
export const getSingleCoupon = asyncHandler(async(req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    res.json({
        success: true,
        message: "Coupon Fetched",
        coupon,
    });
})
// @desc update Coupon
// @route PUT /api/v1/coupon/:id
// @access Private
export const updateCoupon = asyncHandler(async(req, res) => {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
        code: code?.toUpperCase(),
        discount,
        startDate,
        endDate
    },
    {
        new: true,
    });
    res.json({
        success: true,
        message: "Coupons updated successfully",
        coupon,
    });
})
// @desc delete Coupon
// @route DELETE /api/v1/coupon/:id
// @access Private
export const deleteCoupon = asyncHandler(async(req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    res.json({
        success: true,
        message: "Coupons deleted successfully",
        coupon,
    });
})