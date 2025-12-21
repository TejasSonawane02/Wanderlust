import 'dotenv/config';

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
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";


import listingsRoutes from "./routes/listing.js";
import reviewsRoutes from "./routes/review.js"; 
import userRoutes from "./routes/user.js";


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

// Session configuration
app.use(session({
    secret: "thisisasecretkey",
    resave: false,
    saveUninitialized: true,
    cookie:{
      expires: Date.now() + 7*24*60*60*1000,
      maxAge: 7*24*60*60*1000,
      httpOnly: true
    }
}));


// Test route
app.get("/", (req,res) =>{
    res.send("Route working");
});

// Flash middleware
app.use(flash());

// Passport.js configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "demo@mail.com",
//     username: "demouser"
//   });
//   let registeredUser = await User.register(fakeUser, "demopassword"); //register method hashes the password and stores it
//   res.send(registeredUser);
//   })

// Middleware to set flash messages in res.locals
app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.update = req.flash("update");
  res.locals.currentUser = req.user;
  next();
});

// Use the routes 
app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);

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