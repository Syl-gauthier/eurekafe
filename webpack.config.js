const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require ("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require ("html-webpack-plugin");

module.exports = {
  devtool: "inline-source-map",
  entry: {index: "./src/index.js"},
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        //resolve-url-loader may be chained before sass-loader if necessary
        use: ["css-loader", "resolve-url-loader", "sass-loader"]
      })
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf|svg|ico)$/,
      loader: "file-loader",
      options: {name: "[name].[ext]"}
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: ["file-loader"]
    },
    {
      test: /\.html$/,
      loader: "html-loader"
    },
    {
      test: /\.pug$/,
      loader: "pug-loader"
    }]
  },
  plugins: [
    new ExtractTextPlugin("[name].style.css"),
    new HtmlWebpackPlugin({template: "./src/index/index.pug"}),
    new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jquery",
      "window.jquery": "jquery",
      Popper: ["popper.js", "default"]
    })
  ]
};