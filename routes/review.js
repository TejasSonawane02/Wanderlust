import express from "express";
const router = express.Router({mergeParams: true});
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import { isLoggedIn, validateReview } from "../middleware.js";
import { isAuthor } from "../middleware.js";
import {postReview, destroyReview} from "../controllers/review.js"

// Add Review route(POST)
router.post("/",isLoggedIn,validateReview, wrapAsync(postReview));

// Delete Review route
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(destroyReview));

export default router;