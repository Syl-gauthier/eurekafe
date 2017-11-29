//admin.js

var express = require("express");
var router = express.Router();

var session = require("express-session");
var passport = require("passport");
var facebookStrat = require("passport-facebook").Strategy;

var multer = require("multer");

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

if(process.env.FACEBOOK_ID && process.env.FACEBOOK_SECRET) {
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
}


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

router.use(express.static("dist-admin"));

router.get("/auth/success", function(req, res) {
  //redirect to /admin/dashboard after 1sec
  res.render("loginSuccess");
});

router.get("/dashboard", function(req, res) {
  res.render("adminDashboard");
});

router.get("/senar", function(req, res) {
  var knownType = ["annonce","revue","article","evenement"];
  console.log(req.query.type);
  if(~knownType.indexOf(req.query.type)) {
    res.render("senar", {type: req.query.type});  
  } else {
    res.send("error, unknown senario type");
  }  
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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/../dist/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

var uploader = multer({
  storage});

router.post("/submit", uploader.single("image"), function(req, res) {
  var twitter = require("../lib/twitter.js")();
  var query = {};
  console.log(req.body);
  console.log(req.file);
  if(req.file) {
    query.img = req.file;
  }
  query.status = req.body.status;
  twitter.post(query, function(err, data) {
    if(err) res.send(err);
    else res.send(data);
  });
});

module.exports = router;