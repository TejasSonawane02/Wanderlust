import express from "express";
const router = express.Router({mergeParams: true});
import wrapAsync from "../utils/wrapAsync.js";
import {reviewSchema } from "../schema.js"; 
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import Review from "../models/review.js";


// Validation middleware for reviews
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// Add Review route(POST)
router.post("/",validateReview, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review added!");
    res.redirect(`/listings/${id}`);
}));

// Delete Review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // Remove reference from Listing
    await Review.findByIdAndDelete(reviewId); // Delete the review document
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}));

export default router;