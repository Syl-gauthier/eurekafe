//gulpfile.js
/* eslint no-console: "off" */

"use strict";

var gulp = require("gulp");
var nodemon = require("nodemon");
var rimraf= require("rimraf");
var webpack = require("webpack-stream");

gulp.task("default", ["server-prod"]);

gulp.task("build", ["webpack"], function() {
  process.exit(0);
});

gulp.task("clean", function(done) {
  rimraf("dist/**", function(err) {
    done(err);
  });
});

function buildWebpack() {
  return gulp.src("src/index.js")
    .pipe(webpack( require("./webpack.config.js") ))
    .pipe(gulp.dest("dist/"));
}

gulp.task("webpack", ["clean"], buildWebpack);
gulp.task("webpack-watch", buildWebpack);

gulp.task("server-prod", ["watch"], function() {
  // configure nodemon
  nodemon({
    // the script to run the app
    script: "app.js",
    // this listens to changes in any of these files/routes and restarts the application
    watch: ["app.js", "routes/", "lib/", ".env"],
    ext: "js"
  }).on("restart", () => {
    console.log("Change detected... restarting server...");
    gulp.src("server.js");
  });
});

gulp.task("watch", ["webpack"], function () {
  gulp.watch("./src/**", ["webpack-watch"]);
});
