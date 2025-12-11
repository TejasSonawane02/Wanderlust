import express from "express";
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema} from "../schema.js"; 
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";

// We have to use double dot (..) because we are in a routes folder and need to access utils and models folder which are in the parent directory.

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

//Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New Listing GET route 
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create Listing POST route    
router.post("/", validateListing, wrapAsync(async (req, res,next) => {  
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })  
);

//Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

// Edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Update route
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
    console.log("Deleted Listing: ", deletedListing);
}));

export default router;
