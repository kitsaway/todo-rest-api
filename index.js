const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const todoRoutes = require("./routes/todoRoutes.js");
const bodyParser = require("body-parser");
const cors = require("cors");

mongoose.Promise = global.Promise;
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(function (req, res, next) {
  if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
    return res.sendStatus(204);
  }
  return next();
});
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", todoRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Server is successfully running");
});

// Connection to db
const mongoDB = process.env.MONGODB_URI || process.env.DB_URL;
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("Connected to db!");
    app.listen(PORT, () => console.log("Server Up and running"));
  }
);
