import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import dotenv from 'dotenv';
import Order from "../model/Order.js";
import User from "../model/userModel.js";
import Product from "../model/product.js";
import Coupon from "../model/Coupon.js";

// dotenv config
dotenv.config();

// make use of stripe(stripe instance)
const stripe = new Stripe(process.env.STRIPE_KEY);

// @desc Create Order
// @route POST /api/v1/order
// @access Private/admin
export const createOrder = asyncHandler(async (req, res) => {
    // get the coupon
    const { coupon } = req?.query;
    const couponFound = await Coupon.findOne({
        code: coupon?.toUpperCase()
    })
    if (couponFound?.isExpired) {
        throw new Error("Coupon has expired")
    }
    if (!couponFound) {
        throw new Error("Coupon does not exist")
    }
    // get the disount
    const discount = couponFound?.discount / 100;
    // get the payload
    const { orderItems, shippingAddress, totalPrice } = req.body;
    // find the user
    const user = await User.findById(req.userAuthId);
    //check if user has shipping address
    if (!user?.shippingAddress) {
        throw new Error("Please provide shipping address")
    }
    // check if order is not empty
    if (orderItems?.length <= 0) {
        throw new Error("No order Items");
    }
    // create order 
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    });
    // update the product quantity
    const products = await Product.find({ _id: { $in: orderItems } });

    orderItems?.map(async (order) => {
        const product = products?.find((product) => {
            return product?._id?.toString() === order?._id?.toString();
        });
        if (product) {
            product.totalSold += order.qty;
        }
        await product.save();
    });
    // push order to user
    user.orders.push(order?._id);
    // resave
    await user.save();
    // make payment (stripe)
    //convert order items to have same structure that stripe need
    const convertedOrders = orderItems.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item?.name,
                    description: item?.description,
                },
                unit_amount: item?.price * 100,
            },
            quantity: item?.qty,
        };
    });
    const session = await stripe.checkout.sessions.create({
        line_items: convertedOrders,
        metadata: {
            orderId: JSON.stringify(order?._id),
        },
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
    });
    res.send({ url: session.url });
    // payment webhook
    // update the user order
    // res.json({
    //     success: true,
    //     message: "Order Created",
    //     order,
    //     user,
    // })
})

// @desc get all Order
// @route Get /api/v1/order
// @access Private/admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    res.json({
        success: true,
        message: 'All Orders',
        orders,
    });
})

// @desc get single Order
// @route POST /api/v1/order/:id
// @access Private/admin
export const getSingleOrder = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id);
    res.status(200).json({
        success: true,
        message: 'Single Order',
        order,
    });
})

// @desc Update Order
// @route PUT /api/v1/order/update:id
// @access Private/admin
export const updateOrder = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const order = await Order.findByIdAndUpdate(id, {
        status: req.body.status,
    },
        {
            new: true,
        });
    res.status(200).json({
        success: true,
        message: "Order Updated",
        order
    });
})

// @desc sales sum of Order
// @route PUT /api/v1/order/sales/sum
// @access Private/admin
export const getOrderStats = asyncHandler(async(req, res) => {
    // get order stats
    const orders = await Order.aggregate([
        {
            $group: {
                _id: null,
                minimumSale: {
                    $min: "$totalPrice",
                },
                totalSale: {
                    $sum: "$totalPrice",
                },
                maximunSale: {
                    $max: "$totalPrice",
                },
                avgSale: {
                    $avg: "$totalPrice"
                },
            }
        }
    ]);
    // get the date
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const saleToday = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: today,
                },
            },
        },
        {
            $group: {
                _id: null,
                totalSale: {
                    $sum: "$totalPrice",
                },
            },
        },
    ]);
    // send response
    res.status(200).json({
        success: true,
        message: "Sum of orders",
        orders,
        saleToday,
    });
})