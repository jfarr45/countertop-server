/** @format */

// Set up
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var cors = require("cors");

// Configuration
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/countertops"
);

app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, POST, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Model
var Countertop = mongoose.model("Countertop", {
  unit_number: String,
  left_wall_length: Number,
  left_wall_depth: Number,
  back_wall_length: Number,
  back_wall_depth: Number,
  right_wall_length: Number,
  right_wall_depth: Number,
  left_finish: String,
  left_endsplash: String,
  right_finish: String,
  right_endsplash: String
});

// Get all countertops
app.get("/api/countertops", function (req, res) {
  console.log("Listing measured countertops...");

  //use mongoose to get all countertops in the database
  Countertop.find(function (err, countertops) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) {
      res.send(err);
    }

    res.json(countertops); // return all countertops in JSON format
  });
});

// Create a countertop
app.post("/api/countertops", function (req, res) {
  console.log("Adding countertop...");

  Countertop.create(
    {
      unit_number: req.body.unit_number,
      left_wall_length: req.body.left_wall_length,
      left_wall_depth: req.body.left_wall_depth,
      back_wall_length: req.body.back_wall_length,
      back_wall_depth: req.body.back_wall_depth,
      right_wall_length: right_wall_length,
      right_wall_depth: right_wall_depth,
      left_finish: req.body.left_finish,
      left_endsplash: req.body.left_endsplash,
      right_finish: req.body.right_finish,
      right_endsplash: req.body.right_endsplash,
      done: false,
    },
    function (err, countertop) {
      if (err) {
        res.send(err);
      }

      // create and return all the countertops
      Countertop.find(function (err, countertops) {
        if (err) res.send(err);
        res.json(countertops);
      });
    }
  );
});

// Update a countertop
app.put("/api/countertops/:id", function (req, res) {
  const countertop = {
    unit_number: req.body.unit_number,
    left_wall_length: req.body.left_wall_length,
    left_wall_depth: req.body.left_wall_depth,
    back_wall_length: req.body.back_wall_length,
    back_wall_depth: req.body.back_wall_depth,
    right_wall_length: right_wall_length,
    right_wall_depth: right_wall_depth,
    left_finish: req.body.left_finish,
    left_endsplash: req.body.left_endsplash,
    right_finish: req.body.right_finish,
    right_endsplash: req.body.right_endsplash,
  };
  console.log("Updating item - ", req.params.id);
  Countertop.update({_id: req.params.id }, countertop, function (err, raw) {
    if (err) {
      res.send(err);
    }
    res.send(raw);
  });
});

// Delete a grocery Item
app.delete("/api/countertops/:id", function (req, res) {
  Countertop.remove(
    {
      _id: req.params.id,
    },
    function (err, countertop) {
      if (err) {
        console.error("Error deleting countertop ", err);
      } else {
        Countertop.find(function (err, countertops) {
          if (err) {
            res.send(err);
          } else {
            res.json(countertops);
          }
        });
      }
    }
  );
});

// Start app and listen on port 8080
app.listen(process.env.PORT || 8080);
console.log("Countertop server listening on port  - ", process.env.PORT || 8080);