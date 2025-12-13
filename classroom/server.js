//Exploring Cookies in Express.js
import express from "express";
const app = express();
// import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from 'url';
import flash from "connect-flash";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// 1. Cookie Management with cookie-parser
// Use cookie-parser middleware
// app.use(cookieParser("secretcode")); // 'secretcode' is used to sign cookies

// // Routes
// app.get("/", (req, res) => {
//     res.send("Hi there! Welcome to the Cookie Explorer.");
// });

// app.get("/getsigned-cookie", (req, res) => {
//     res.cookie("session_id", "abc123xyz", { httpOnly: true, signed: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
//     res.send("Signed cookie 'session_id' has been set!");
// });

// app.get("/get-cookie", (req, res) => {
//     res.cookie("username", "wanderlustUser", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
//     res.send("Cookie 'username' has been set!");
// });

// app.get("/show-cookies", (req, res) => {
//     // Read cookies
//     const cookies = req.cookies;
//     console.dir(cookies);
//     res.send(cookies);
// });

// app.get("/verify", (req, res) => {
//     // Read signed cookies
//     const signedCookies = req.signedCookies;
//     console.dir(signedCookies);
//     res.send(signedCookies);
// });

// Session Management with express-session
app.use(session({secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// connect-flash requires sessions, so initialize it after session middleware
app.use(flash());

// Routes to demonstrate session usage
app.get("/views", (req, res) => {
    if (req.session.views) {
        req.session.views++;    
        res.send(`You have visited this page ${req.session.views} times.`);
    } else {
        req.session.views = 1;
        res.send("Welcome to this page for the first time!");
    }
});

//Routes to demonstrate data storage and USAGE in session accross different routes
app.get("/register", (req,res) =>{
    let {username = "Anonymous"} = req.query;
    req.session.username = username;
    if(username === "Anonymous"){
        req.flash("failed", "No username provided, registration failed!");;
    }else{
        req.flash("success", "Registration successful!"); 
    }
    res.redirect("/greet");
});

app.get("/greet", (req,res) =>{
    res.locals.messages = req.flash("success");
    res.locals.errors = req.flash("failed");
    res.render("page.ejs", {username: req.session.username});   //no need to pass messages explicitly as res.locals is accessible in all views
});

// In the above example, when a user accesses /register?username=JohnDoe, their username is stored in the session.
// When they are redirected to /greet, the server retrieves the username from the session and greets them accordingly.
// This demonstrates how session data can persist across different routes for the same user.

// Session Index Route
app.get("/", (req, res) => {
    res.send("Hi there! Welcome to the Session Explorer.");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});


