import express from "express";
const router = express.Router();
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import ExpressError from "../utils/ExpressError.js";
import saveRedirectedTo  from "../middleware.js";    


// Get user registration form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// POST route for user registration
router.post("/signup", wrapAsync(async(req, res) => {
    try{const { username,email, password } = req.body;
    const newUser = new User({ username, email }); // Create a new user instance
    const regUser = await User.register(newUser, password); //register method hashes the password and stores it
    console.log(regUser);
    req.login(regUser, err => {
        if(err) {return next(err);}
        req.flash("success", "Registration successful!");
        res.redirect("/listings");
    });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }  
}));

// Get user login form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// POST route for user login
router.post("/login",saveRedirectedTo, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
    }), wrapAsync(async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings" // or is added to avoid redirecting to undefined
    res.redirect(redirectUrl); 
}));

// Logout route
router.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
});

export default router;