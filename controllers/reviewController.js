import asyncHandler from "express-async-handler";
import Review from "../model/Review.js";
import Product from "../model/product.js";

export const createReview = asyncHandler(async(req, res) => {
    const {product, message, rating} = req.body;
    // find the product
    const productID = req.params;
    const productFound = await Product.findById(productID).populate('reviews');
    if (!productFound) {
        throw new Error("Product not found")
    }
    // check if user already reviewed the product
    const hasReviewed = productFound?.reviews?.find((reviews) => {
        return review?.user?.toString() === req?.userAuthId?.toString();
    })
    if (hasReviewed) {
        throw new Error("You have already reviwed this product")
    }
    // create the review
    const review = await Review.create({
        message,
        rating,
        product: productFound?._id,
        user: req.userAuthId,
    });
    // push review to product
    productFound.reviews.push(review?.id)
})