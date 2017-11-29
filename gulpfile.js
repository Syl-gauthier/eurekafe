//gulpfile.js
/* eslint no-console: "off" */

"use strict";

var gulp = require("gulp");
var gutil = require("gulp-util");
var nodemon = require("nodemon");
var webpack = require("webpack");
var webpackConfigPublic = require("./webpack.config.js");
var webpackConfigAdmin = require("./admin-webpack.config.js");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");

gulp.task("default", ["server-dev"]);

gulp.task("build", ["webpack:build-dev"], function(done) {
  done();
});

gulp.task("build-dev", ["webpack:build-dev"], function() {
  gulp.watch(["src/**/*"], ["webpack:build-dev"]);
});

var publicConfig = Object.create(webpackConfigPublic);
publicConfig.devtool = "inline-source-map";

// create a single instance of the compiler to allow caching
var devCompilerPublic = webpack(publicConfig);

gulp.task("buildPublic", function(callback) {
  // run webpack
  devCompilerPublic.run(function(err, stats) {
    if(err) throw new gutil.PluginError("buildPublic", err);
    gutil.log("[buildPublic]", stats.toString({
      colors: true
    }));
    callback();
  });
});


var adminConfig = Object.create(webpackConfigAdmin);
adminConfig.devtool = "inline-source-map";


// create a single instance of the compiler to allow caching
var devCompilerAdmin = webpack(adminConfig);

gulp.task("buildAdmin", function(callback) {
  // run webpack
  devCompilerAdmin.run(function(err, stats) {
    if(err) throw new gutil.PluginError("buildAdmin", err);
    gutil.log("[buildAdmin]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task("webpack:build-dev", ["buildPublic", "buildAdmin"]);

var publicConfigProd = Object.create(webpackConfigPublic);
publicConfigProd.plugins.push(new UglifyJSPlugin());


// create a single instance of the compiler to allow caching
var prodCompilerPublic = webpack(publicConfig);

gulp.task("buildPublicProd", function(callback) {
  // run webpack
  prodCompilerPublic.run(function(err, stats) {
    if(err) throw new gutil.PluginError("buildPublicProd", err);
    gutil.log("[buildPublicProd]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task("server-dev", ["build-dev"], function() {
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

