import Listing from "./models/listing.js";
import Review from "./models/review.js";
import { listingSchema } from "./schema.js";
import { reviewSchema } from "./schema.js";
import ExpressError from "./utils/ExpressError.js";

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to access that page!");
        return res.redirect("/login");
    }
    next();
};

const saveRedirectedTo = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the owner of this listing!");
        return  res.redirect(`/listings/${id}`);
    }
    next();
}

// Validation middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

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

const isAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review){
        req.flash("error", "Review not found.");
        return res.redirect(`/listings/${id}`);
    }
    // normalize IDs to strings for a reliable comparison
    const authorId = (review.author && review.author._id) ? review.author._id.toString() : String(review.author);
    const currentUser = req.user || res.locals.currentUser;
    if(!currentUser){
        req.flash("error", "You must be logged in to perform that action.");
        return res.redirect(`/listings/${id}`);
    }
    const currentUserId = (currentUser._id) ? currentUser._id.toString() : String(currentUser);

    // debug logging (safe in dev) to help trace mismatches
    if(process.env.NODE_ENV !== 'production'){
        console.log(`isAuthor check: reviewId=${reviewId}, review.author=${authorId}, currentUser=${currentUserId}`);
    }

    // prefer Mongoose equals when available, otherwise compare strings
    try{
        const authorVal = (review.author && review.author._id) ? review.author._id : review.author;
        const userVal = (currentUser && currentUser._id) ? currentUser._id : currentUser;
        let isSame = false;
        if(authorVal && typeof authorVal.equals === 'function' && userVal){
            isSame = authorVal.equals(userVal);
        } else if(authorVal && userVal){
            isSame = String(authorVal) === String(userVal);
        }
        if(!isSame){
            req.flash("error", "You are not the author of this review!");
            return res.redirect(`/listings/${id}`);
        }
    } catch (e) {
        console.error('isAuthor comparison error', e);
        req.flash("error", "Authorization check failed.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

export default saveRedirectedTo;

export { isLoggedIn, isOwner, validateListing, validateReview, isAuthor };