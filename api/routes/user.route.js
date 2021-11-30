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

  if (name === "") {
    //console.log("Person's name cannot be empty");
    res.json("Person's name cannot be empty");
    return;
  }
  //If name is already present, update its fields else add the new name
  User.findOneAndUpdate(
    { person_name: name },
    { $inc: { freq_count: 1 }, $set: { req_time: new Date() } }
  )
    .then((user) => {
      console.log("Within findOneAndUpdate");
      if (Object.keys(user).length != 0) {
        console.log(user);
        res.json("Updated user");
      } else {
        console.log("Correctly entered section for new user");
        reqUser.freq_count = 1;
        reqUser.req_time = new Date();
        reqUser
          .save()
          .then((savedUser) => {
            console.log(savedUser);
            res.json("Added user");
          })
          .catch((saveErr) => {
            res.status(500).json("Unable to add user");
          });
      }
    })
    .catch((err) => {
      console.log("Error encountered:", err);
      res.status(500).json("Could not fetch users");
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
