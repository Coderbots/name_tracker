const express = require("express");
const userRoutes = express.Router();

let User = require("../models/user");

userRoutes.route("/").post((req, res) => {
  if (Object.keys(req.body).length === 0) {
    //console.log("Request body cannot be empty");
    res.json("Request body cannot be empty");
    return;
  }

  let reqUser = new User(req.body);
  // console.log(User);
  // console.log("reqUser", reqUser);

  let name = req.body.person_name;

  console.log("In save");

  if (name === "") {
    //console.log("Person's name cannot be empty");
    res.json("Person's name cannot be empty");
    return;
  }

  User.findOneAndUpdate(
    { person_name: name },
    { $inc: { freq_count: 1 }, $set: { req_time: new Date() } }
  )
    .then((user) => {
      console.log("Within findOneAndUpdate");
      if (Object.keys(user).length != 0) {
        //user.created_time = Date.now();
        console.log(user);
        res.json("Updated user");
      } else {
        console.log("Correctly entered section for new user");
        reqUser.freq_count = 1;
        //console.log("Set freq_count", reqUser.req_time);
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

userRoutes.route("/topfive").get(function (req, res) {
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

userRoutes.route("/mostrecent").get(function (req, res) {
  console.log("Trying to find mostrecent added user");

  User.find()
    .sort({ req_time: -1 })
    .limit(1)
    .select("person_name req_time -_id")
    .then((users) => {
      res.json(users);
      //res.json({users:users._id});
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("Could not fetch users");
    });
});

module.exports = userRoutes;
