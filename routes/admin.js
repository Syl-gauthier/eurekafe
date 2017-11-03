//admin.js

var express = require("express");
var router = express.Router();

var session = require("express-session");
var passport = require("passport");
var facebookStrat = require("passport-facebook").Strategy;

var expressSession = session({
  secret: "just another secret",
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 1800000}
});

router.use(expressSession);

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, cb) {
  //console.log (user, "serialized");
  return cb(null, user);
});
passport.deserializeUser(function(user, done) {
  //console.log(user, "deserialized");
  return done(null, user);
});

passport.use(new facebookStrat({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: "/admin/auth/callback",
  profileFields: ["id", "displayName", "photos", "email"]
},
function(accessToken, refreshToken, profile, cb) {
  cb(null, profile);
}));

router.get("/", passport.authenticate("facebook", {scope: ["email"]}));

router.get("/auth/callback", passport.authenticate("facebook", {failureRedirect: "fail"}), 
  function(req, res) {
    res.redirect("success");
  }
);

//after this, user need to be logged in
router.use(function(req, res, next) {
  if(req.user) {
    next();
  }
  else {
    res.redirect("/");
  }
});

router.get("/publish", function(req, res) {
  res.render("publish");
});

router.post("/publish", function(req, res) {
  console.log(req.body);
  res.send("oui");
});

module.exports = router;