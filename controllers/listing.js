import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import { cloudinary } from "../cloudConfig.js";

const index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

const getListing = (req, res) => {
    res.render("listings/new.ejs");
};

const postListing = async (req, res,next) => { 
    let url = req.file.path;
    let filename = req.file.filename; 
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
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
    // Update basic fields
    const updated = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    if(!updated){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // If a new image was uploaded, delete old image from Cloudinary and replace the image field
    if (req.file) {
        // delete previous image from Cloudinary if present
        if (updated.image && updated.image.filename) {
            try {
                await cloudinary.uploader.destroy(updated.image.filename);
            } catch (e) {
                console.warn('Failed to delete previous image from Cloudinary:', e.message || e);
            }
        }
        const url = req.file.path;
        const filename = req.file.filename;
        updated.image = { url, filename };
        await updated.save();
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
