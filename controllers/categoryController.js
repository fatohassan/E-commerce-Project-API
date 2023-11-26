import asyncHandler from 'express-async-handler';
import Category from '../model/category.js';

// @desc Create Category
// @route POST /api/v1/category
// @access Private/admin
export const createCategory = asyncHandler(async(req, res) => {
    const {name} = req.body;
    // category exists 
    const categoryExist = await Category.findOne({name});
    if(categoryExist) {
        throw new Error("Category Already Exists")
    }
    // create the category
    const category = await Category.create({
        name: name?.toLowerCase(), 
        user: req.userAuthId,
        image: req.file.path,
    })
    // send response
    res.json({
        status: "success",
        message: "Category Created Succussfully",
        category,
    });
});

// @desc Get Categories
// @route GET /api/v1/category
// @access Public
export const getCategories = asyncHandler(async(req, res) => {
    //query
    const categories = await Category.find();
    res.json({
        status: "success",
        message: "category fetched successfully",
        categories,
    })
})

// @desc get category
// @route Get /api/v1/category/:id
// @access Public
export const getCategory = asyncHandler(async(req, res) => {
    const category = await category.findById(req.params.id);
    if (!category) {
        throw new Error("category Not Found");
    }
    res.json({
        status: "success",
        message: "category fetched successfully",
        category,
    });
});

// @desc Update category
// @route Put /api/v1/category/:id
// @access Private/Admin
export const updateCategory = asyncHandler(async(req, res) => {
    const {name} =
    req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, 
        {name},
        {
            new: true,
        });
    res.json({
        status: "success",
        message: "Category updated successfully",
        category,
    });
});

// @desc Delete Category
// @route Delete /api/v1/category/:id
// @access Private/Admin
export const deletedCategory = asyncHandler(async(req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "category deleted successfully",
    });
});

