import express from "express";
const router = express.Router({mergeParams: true});
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import { isLoggedIn, validateReview } from "../middleware.js";
import { isAuthor } from "../middleware.js";

// Add Review route(POST)
router.post("/",isLoggedIn,validateReview, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review added!");
    res.redirect(`/listings/${id}`);
}));

// Delete Review route
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // Remove reference from Listing
    await Review.findByIdAndDelete(reviewId); // Delete the review document
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}));

export default router;