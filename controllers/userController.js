import asyncHandler from 'express-async-handler';
import User from '../model/userModel.js';
import bcrypt from 'bcrypt';
import { generateTokenFromHeader } from '../utils/generateTokenFromHeader.js';
import { verifyToken } from '../utils/verifyToken.js';
import generateToken from '../utils/generateToken.js';

// @desc Resgister User
// @route POST /api/v1/users/register
// @access Private/Admin
export const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        throw new Error("User already exists!");
    }
    //hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // create user
    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
    });
    res.status(201).json({
        status: "success",
        message: "User created successfully",
        user,
    });
})

// @desc Login User
// @route POST /api/v1/users/login
//access Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });
    if (userFound && (await bcrypt.compare(password, userFound?.password))) {
        res.json({
            status: "success",
            message: "User logged in successfully",
            userFound,
            token: generateToken(userFound?._id),
        })
    } else {
        throw new Error("Invalid Data")
    }
});

// @desc Get User Profile
// @route GET /api/v1/users/profile
// @access Private/profile
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userAuthId).populate("orders");
    res.json({
        status: "success",
        message: "User profile fetched successfully",
        user
    });
})

// @desc Update user shipping address
// @route PUT /api/v1/users/update/shipping
// @access Private
export const updateShippingAddress = asyncHandler(async (req, res) => {
    const { firstName, lastName, address, city, postalCode, province, phone } =
        req.body;
    const user = await User.findByIdAndUpdate(
        req.userAuthId,
        {
            shippingAddress: {
                firstName,
                lastName,
                address,
                city,
                postalCode,
                province,
                phone,
            },
            hasShippingAddress: true,
        },
        {
            new: true,
        }
    );
    // send respnse
    res.json({
        status: "success",
        message: "User shipping address updated successfully",
        user,
    });
});