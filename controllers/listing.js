import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";

const index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

const getListing = (req, res) => {
    res.render("listings/new.ejs");
};

const postListing = async (req, res,next) => {  
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    if(!newListing){
        return next(new ExpressError(500, "Failed to create new listing"));
    }else{
    req.flash("success", "Successfully created a new listing!");
    }
    res.redirect("/listings");
  };

const getShow = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({path:"reviews", populate: {path: "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

const getEdit = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
};

const updateListing = async (req, res) => {
    let {id} = req.params;
    const updated = await Listing.findByIdAndUpdate(id, req.body.listing);
    if(!updated){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

const destroyListing = async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if(!deletedListing){
        req.flash("error", "Listing not found!");
    } else {
        req.flash("success", "Listing Deleted!");
    }
    console.log("Deleted Listing: ", deletedListing);
    res.redirect(`/listings`);
};

export {index, getListing, postListing, getShow, getEdit, updateListing, destroyListing};
