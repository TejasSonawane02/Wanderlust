//Exploring Cookies in Express.js
import express from "express";
const app = express();
import cookieParser from "cookie-parser";

// Use cookie-parser middleware
app.use(cookieParser("secretcode")); // 'secretcode' is used to sign cookies

// Routes
app.get("/", (req, res) => {
    res.send("Hi there! Welcome to the Cookie Explorer.");
});

app.get("/getsigned-cookie", (req, res) => {
    res.cookie("session_id", "abc123xyz", { httpOnly: true, signed: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
    res.send("Signed cookie 'session_id' has been set!");
});

app.get("/get-cookie", (req, res) => {
    res.cookie("username", "wanderlustUser", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
    res.send("Cookie 'username' has been set!");
});

app.get("/show-cookies", (req, res) => {
    // Read cookies
    const cookies = req.cookies;
    console.dir(cookies);
    res.send(cookies);
});

app.get("/verify", (req, res) => {
    // Read signed cookies
    const signedCookies = req.signedCookies;
    console.dir(signedCookies);
    res.send(signedCookies);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});


