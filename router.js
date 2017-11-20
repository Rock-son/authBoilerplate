var Authentication = require("./controllers/authentication"),
    Log = require("./services/morganLog"),
    passportService = require("./services/passport"),
    passport = require("passport"),

    requireAuth = passport.authenticate("jwt", {session: false}),
    requireSignin = passport.authenticate("local", {session: false});




module.exports = function(app) {

    app.get("/", requireAuth, function(req, res) {
        res.send({hi: "there"});
    });
    // sign up
    app.post("/signup", Authentication.signup);
    // sign in
    app.post("/signin", requireSignin, Authentication.signin);       

    // logging (Helmet-csp) CSP blocked requests
    app.post("/report-violation", Log.logged);

}