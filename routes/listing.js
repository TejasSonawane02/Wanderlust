import express from "express";
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js"; 
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import { isLoggedIn } from "../middleware.js";
import { isOwner } from "../middleware.js";
import { validateListing } from "../middleware.js";

// We have to use double dot (..) because we are in a routes folder and need to access utils and models folder which are in the parent directory.


//Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New Listing GET route 
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Create Listing POST route    
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res,next) => {  
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    if(!newListing){
        return next(new ExpressError(500, "Failed to create new listing"));
    }else{
    req.flash("success", "Successfully created a new listing!");
    }
    res.redirect("/listings");
  })  
);

//Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({path:"reviews", populate: {path: "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

// Edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

// Update route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const updated = await Listing.findByIdAndUpdate(id, req.body.listing);
    if(!updated){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if(!deletedListing){
        req.flash("error", "Listing not found!");
    } else {
        req.flash("success", "Listing Deleted!");
    }
    console.log("Deleted Listing: ", deletedListing);
    res.redirect(`/listings`);
}));

export default router;
