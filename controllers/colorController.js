import asyncHandler from 'express-async-handler';
import Color from '../model/Colors.js';

// @desc Create color
// @route POST /api/v1/color
// @access Private/admin
export const createColor = asyncHandler(async(req, res) => {
    const {name} = req.body;
    // color exists 
    const colorExist = await Color.findOne({name});
    if(colorExist) {
        throw new Error("Color Already Exists")
    }
    // create the color
    const color = await Color.create({
        name: name.toLowerCase(), 
        user: req.userAuthId,
    })
    // send response
    res.json({
        status: "success",
        message: "Color Created Succussfully",
        color,
    });
});

// @desc Get color
// @route GET /api/v1/color
// @access Public
export const getColors = asyncHandler(async(req, res) => {
    //query
    const colors = await Color.find();
    res.json({
        status: "success",
        message: "Color fetched successfully",
        colors,
    })
})

// @desc get color
// @route Get /api/v1/color/:id
// @access Public
export const getColor = asyncHandler(async(req, res) => {
    const color = await Color.findById(req.params.id);
    if (!color) {
        throw new Error("Color Not Found");
    }
    res.json({
        status: "success",
        message: "Color fetched successfully",
        color,
    });
});

// @desc Update color
// @route Put /api/v1/color/:id
// @access Private/Admin
export const updateColor = asyncHandler(async(req, res) => {
    const {name} =
    req.body;
    const color = await Color.findByIdAndUpdate(req.params.id, 
        {name},
        {
            new: true,
        });
    res.json({
        status: "success",
        message: "Color updated successfully",
        color,
    });
});

// @desc Delete color
// @route Delete /api/v1/color/:id
// @access Private/Admin
export const deletedColor = asyncHandler(async(req, res) => {
    const color = await Color.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Color deleted successfully",
    });
});

