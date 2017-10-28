//gulpfile.js
/* eslint no-console: "off" */

"use strict";

var gulp = require("gulp");
var rimraf = require("rimraf");
var sass = require("gulp-sass");
var cleanCSS = require("gulp-clean-css");
var nodemon = require("nodemon");

gulp.task("default", ["server-prod"]);

gulp.task("build", ["sass"], function() {
  process.exit(0);
});

gulp.task("clean", function(done) {
  rimraf("public/style/*.css", function(err) {
    done(err);
  });
});

var buildSASS = function () {
  return gulp.src("./src/style/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({compatibility: "ie8"}))
    .pipe(gulp.dest("./public/style/"));      
};

gulp.task("sass", ["clean"], buildSASS);
gulp.task("sass-watch", buildSASS);

gulp.task("server-prod", ["watch"], function() {
  // configure nodemon
  nodemon({
    // the script to run the app
    script: "app.js",
    // this listens to changes in any of these files/routes and restarts the application
    watch: ["app.js", "routes/", "lib/**", ".env"],
    ext: "js"
  }).on("restart", () => {
    console.log("Change detected... restarting server...");
    gulp.src("server.js");
  });
});

gulp.task("watch", ["sass"], function () {
  gulp.watch("./src/style/**/*.scss", ["sass-watch"]);
});
