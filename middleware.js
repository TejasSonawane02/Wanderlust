const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to access that page!");
        return res.redirect("/login");
    }
    next();
};

const saveRedirectedTo = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

export default saveRedirectedTo;

export { isLoggedIn };