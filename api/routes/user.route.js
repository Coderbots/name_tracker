const express = require("express");
const userRoutes = express.Router();

let User = require("../models/user");


//POST Endpoint for insertion of name
userRoutes.route("/").post((req, res) => {

  if (Object.keys(req.body).length === 0) {
    //console.log("Request body cannot be empty");
    res.json("Request body cannot be empty");
    return;
  }

  let reqUser = new User(req.body);

  let name = req.body.person_name;

  console.log("In save");

  // Prevent MongoDB injection attack
  if (typeof name === 'string') {
    // this is a string
    console.log("Username is validated to be a string")
  } else {
    console.log("Username is not a string but is of type:",typeof name)
    res.status(400).json("Username must be a string!");
    return;
  }

  if (name === "") {
    //console.log("Person's name cannot be empty");
    res.status(400).json("Person's name cannot be empty");
    return;
  }
  //If name is already present, update its fields else add the new name
  User.findOneAndUpdate(
    { person_name: name },
    { $inc: { freq_count: 1 }, $set: { req_time: new Date() } },
    // Setting new to true to return new document
    // Setting upsert to true to add document if not present
    { upsert: true, new: true } 
  )
    .then((user) => {
      console.log("Within findOneAndUpdate");

      console.log("Updated user:",user);
      res.json("Updated user");
    })
    .catch((err) => {
      console.log("Error encountered:", err);
      res.status(500).json("Could not add users");
    });
});

//GET Endpoint to obtain top 5 inserted names
userRoutes.route("/topfive").get(function (req, res) {
  //Sort names based on count and limits results to top 5
  User.find()
    .sort({ freq_count: -1 })
    .limit(5)
    .select("person_name freq_count req_time -_id")
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("Could not fetch users");
    });
});

//GET Endpoint to obtain recently inserted name
userRoutes.route("/mostrecent").get(function (req, res) {
  console.log("Trying to find mostrecent added user");
  //Sorts the name based on time and limits results to 1
  User.find()
    .sort({ req_time: -1 })
    .limit(1)
    .select("person_name req_time -_id")
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("Could not fetch users");
    });
});

module.exports = userRoutes;
