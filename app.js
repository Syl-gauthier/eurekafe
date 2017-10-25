// app.js
/* eslint no-console: "off" */

"use strict";

require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const port = process.env.PORT||3000;

const app = express();

app.use(morgan("tiny"));

app.use(express.static("public"));


const Twitter = require("twitter");

console.log(typeof Twitter);

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONS_KEY,
  consumer_secret: process.env.TWITTER_CONS_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const retweet = require("retweet")(client);


retweet.get("919262509227323392", {style: "tiny"}).then(function(result) {
  console.log(result);
});

app.listen(port, function() {
  console.log("\x1b[32m", "app listening on port", port, "\x1b[0m");
});
