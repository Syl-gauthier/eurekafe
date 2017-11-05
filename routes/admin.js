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
  console.log(user);
  require("../lib/facebook.js")(user.accessToken);
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
  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken;
  cb(null, profile);
}));

router.get("/", passport.authenticate("facebook", {scope: ["email", "manage_pages", "publish_pages"]}));

router.get("/auth/callback", passport.authenticate("facebook", {failureRedirect: "fail"}), 
  function(req, res) {
    res.redirect("success");
  }
);

router.get("/auth/failure", function(req, res) {
  //loginFailure redirect to public website after 5sec
  res.render("loginFailure");
});

//after this, user need to be logged in
router.use(function(req, res, next) {
  if(req.user) {
    next();
  }
  else {
    res.redirect("/");
  }
});

router.get("/auth/success", function(req, res) {
  //redirect to /admin/dashboard after 1sec
  res.render("loginSuccess");
});

router.get("/dashboard", function(req, res) {
  res.render("adminDashboard");
});

router.get("/publish", function(req, res) {
  res.render("publish");
});

router.post("/publish", function(req, res) {
  res.send("oui");
});

router.get("/twitterFeed", function(req, res) {
  var twitter = require("../lib/twitter.js")();
  twitter.getFeed("AOswd", function(err, tweets) {
    if(err) console.log(err);
    res.send(tweets);
  });
});

router.get("/facebookFeed", function(req, res) {
  console.log(typeof req.user);
  var fb = require("../lib/facebook.js")(req.user.accessToken);
  fb.getFeed(function(err, response) {
    if(err) console.log(err);
    res.send(response);
  });
});

module.exports = router;