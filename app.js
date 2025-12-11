import express from "express";
const app = express();
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url'; 
import { dirname } from 'path';
import methodOverride from 'method-override';
import ejsMate from "ejs-mate"; 
import ExpressError from "./utils/ExpressError.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import listings from "./routes/listing.js";
import reviews from "./routes/review.js"; 


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
 

// Test route
app.get("/", (req,res) =>{
    res.send("Route working");
});

// Use the routes 
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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