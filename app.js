import express from "express";
const app = express();
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import path from "path";
import { fileURLToPath } from 'url'; 
import { dirname } from 'path';
import methodOverride from 'method-override';
import ejsMate from "ejs-mate"; 
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import { listingSchema } from "./schema.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//Middlewares
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs", ejsMate);


// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connection to MongoDB successful");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

main();

// Sample route to create a listing
// app.get("/testListing", async (req, res) => {
//     let sampleListing  = new Listing({
//         title: "Villa Park",
//         description: "A beautiful villa with stunning views.",
//         price: 250,
//         location: "California",
//         country: "USA"
//     });
//     await sampleListing.save();
//     console.log("Sample listing saved:", sampleListing);
//     res.send("Sample listing created");
// });

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// Test route
app.get("/", (req,res) =>{
    res.send("Route working");
});

//Index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New Listing GET route 
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create Listing POST route
app.post("/listings", validateListing, wrapAsync(async (req, res,next) => {  
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })  
);

//Show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

// Edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Update route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
}));

//Delete route
app.delete("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
    console.log("Deleted Listing: ", deletedListing);
}));

// 404 handler
app.all("/*anything", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    let {statusCode, message} = err;
    statusCode = statusCode || 500;
    message = message || "Something went wrong";
    res.status(statusCode).render("error.ejs", {statusCode, message});
});

// Start server
const port = 8081;
app.listen(port, () => {
  console.log(`
  🚀 Server running at:
  👉  http://localhost:${port}/listings
  
  `);
});