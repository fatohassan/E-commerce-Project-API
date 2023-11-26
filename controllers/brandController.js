import asyncHandler from 'express-async-handler';
import Brand from '../model/Brand.js';

// @desc Create Brand
// @route POST /api/v1/brand
// @access Private/admin
export const createBrand = asyncHandler(async(req, res) => {
    const {name} = req.body;
    // brand exists 
    const brandExist = await Brand.findOne({name});
    if(brandExist) {
        throw new Error("Brand Already Exists")
    }
    // create the brand
    const brand = await Brand.create({
        name: name.toLowerCase(), 
        user: req.userAuthId,
    })
    // send response
    res.json({
        status: "success",
        message: "Brand Created Succussfully",
        brand,
    });
});

// @desc Get Brand
// @route GET /api/v1/brand
// @access Public
export const getBrands = asyncHandler(async(req, res) => {
    //query
    const brands = await Brand.find();
    res.json({
        status: "success",
        message: "Brand fetched successfully",
        brands,
    })
})

// @desc get brand
// @route Get /api/v1/brand/:id
// @access Public
export const getBrand = asyncHandler(async(req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
        throw new Error("Brand Not Found");
    }
    res.json({
        status: "success",
        message: "Brand fetched successfully",
        brand,
    });
});

// @desc Update brand
// @route Put /api/v1/brand/:id
// @access Private/Admin
export const updateBrand = asyncHandler(async(req, res) => {
    const {name} =
    req.body;
    const brand = await Brand.findByIdAndUpdate(req.params.id, 
        {name},
        {
            new: true,
        });
    res.json({
        status: "success",
        message: "Brand updated successfully",
        brand,
    });
});

// @desc Delete brand
// @route Delete /api/v1/brand/:id
// @access Private/Admin
export const deletedBrand = asyncHandler(async(req, res) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Brand deleted successfully",
    });
});

