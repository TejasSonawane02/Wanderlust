import express from "express";
const router = express.Router();
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import ExpressError from "../utils/ExpressError.js";
import saveRedirectedTo  from "../middleware.js";    
import {getSignUp, postSignUp, getLogin, postLogin, logout} from "../controllers/user.js";

// Get user registration form
router.get("/signup", getSignUp);

// POST route for user registration
router.post("/signup", wrapAsync(postSignUp));

// Get user login form
router.get("/login", getLogin);

// POST route for user login
router.post("/login",saveRedirectedTo, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
    }), wrapAsync(postLogin));

// Logout route
router.get("/logout", logout);

export default router;