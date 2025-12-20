import User from "../models/user.js";

function getSignUp(req, res) {
    res.render("users/signup.ejs");
}

const postSignUp = async(req, res) => {
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
};

const getLogin = (req, res) => {
    res.render("users/login.ejs");
};

const postLogin = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings" // or is added to avoid redirecting to undefined
    res.redirect(redirectUrl); 
}

const logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
};

export {getSignUp, postSignUp, getLogin, postLogin, logout};