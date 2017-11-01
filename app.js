// app.js
/* eslint no-console: "off" */

"use strict";

const express = require("express");
const morgan = require("morgan");


const app = express();

app.use(morgan("tiny"));

app.use(express.static("public"));

const port = process.env.PORT||3000;

app.listen(port, function() {
  console.log("\x1b[32m", "app listening on port", port, "\x1b[0m");
});
