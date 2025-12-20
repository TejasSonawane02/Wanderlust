import express from "express";
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js"; 
import { isLoggedIn } from "../middleware.js";
import { isOwner } from "../middleware.js";
import { validateListing } from "../middleware.js";
import {index, getListing, postListing, getShow, getEdit, updateListing, destroyListing} from "../controllers/listing.js"

// We have to use double dot (..) because we are in a routes folder and need to access utils and models folder which are in the parent directory.


//Index route
router.get("/", wrapAsync(index));

// New Listing GET route 
router.get("/new", isLoggedIn, getListing );

// Create Listing POST route    
router.post("/",isLoggedIn, validateListing, wrapAsync(postListing));

//Show route
router.get("/:id", wrapAsync(getShow));

// Edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(getEdit));

// Update route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(updateListing));

//Delete route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(destroyListing));

export default router;
