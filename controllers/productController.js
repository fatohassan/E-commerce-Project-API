import asyncHandler from 'express-async-handler';
import Category from "../model/category.js";
import Product from "../model/product.js";
import Brand from "../model/Brand.js";

// @desc Create Prosuct
// @route POST /api/v1/products
// @access Private/admin
export const createProduct = asyncHandler(async(req, res) => {
    const {name, description, category, sizes, colors, brand, price, totalQty} =
    req.body;
    // product exists 
    const productExists = await Product.findOne({name});
    if(productExists) {
        throw new Error("Product Already Exists")
    }
    // category found
    const categoryFound = await Category.findOne({
        name: category,
    });
    if (!categoryFound) {
        throw new Error("Category not found, please create category first or check category name");
    }
    // brand found
    const brandFound = await Brand.findOne({
        name: brand,
    });
    if (!brandFound) {
        throw new Error("brand not found, please create brand first or check brand name");
    }
    // create the product
    const product = await Product.create({
        name, 
        description, 
        category, 
        sizes, 
        colors,
        brand, 
        user: req.userAuthId, 
        price, 
        totalQty
    })
    // push category to products
    categoryFound.products.push(product._id);
    // resave
    await categoryFound.save();
    
    // push brand to products
    brandFound.products.push(product._id);
    // resave
    await brandFound.save();
    // send response
    res.json({
        status: "success",
        message: "Product Created Succussfully",
        product,
    });
});

// @desc Get Products
// @route GET /api/v1/products
// @access Public
export const getProducts = asyncHandler(async(req, res) => {
    //query
    let productQuery = Product.find();
    // filter by name
    if(req.query.name) {
        productQuery = productQuery.find({
            name: {$regex: req.query.name, $options: "i"},
        });
    }
    // filter by brand
    if(req.query.brand) {
        productQuery = productQuery.find({
            brand: {$regex: req.query.brand, $options: "i"},
        });
    }
    // filter by colors
    if(req.query.colors) {
        productQuery = productQuery.find({
            colors: {$regex: req.query.colors, $options: "i"},
        });
    }
    // filter by price range
    if(req.query.price) {
        const priceRange = req.query.price.splite("-");
        productQuery = productQuery.find({
            price: {$gte: priceRange[0], $lte: priceRange[1]},
        });
    }
    // pagination
    // page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    // limit
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    // startIdx
    const startIdx = (page - 1) * limit;
    // endIdx
    const endIdx = page * limit;
    // total
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIdx).limit(limit);
    // pagination results
    const pagination = {};
    if (endIdx < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    if (startIdx > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }
    }
    // await the query
    const products = await productQuery.populate('reviews');
    res.json({
        status: "success",
        total,
        results: products.length,
        pagination,
        message: "Products fetched successfully",
        products,
    })
})

// @desc get Prosuct
// @route Get /api/v1/product/:id
// @access Public
export const getProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id).populate('reviews');
    if (!product) {
        throw new Error("Product Not Found");
    }
    res.json({
        status: "success",
        message: "Product fetched successfully",
        product,
    });
});

// @desc Update Prosuct
// @route Put /api/v1/product/:id
// @access Private/Admin
export const updateProduct = asyncHandler(async(req, res) => {
    const {name, description, category, sizes, colors, brand, user, price, totalQty} =
    req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, 
        {name, 
        description, 
        category, 
        sizes, 
        colors, 
        brand, 
        user, 
        price, 
        totalQty},
        {
            new: true,
        });
    res.json({
        status: "success",
        message: "Product updated successfully",
        product,
    });
});

// @desc Delete Prosuct
// @route Delete /api/v1/product/:id
// @access Private/Admin
export const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Product deleted successfully",
    });
});
