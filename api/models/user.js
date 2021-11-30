const mongoose = require("mongoose");
const schema = mongoose.Schema;

let user = new schema(
  {
    person_name: { //Inserted name
      type: String, 
    },
    freq_count: { //Number of tumes the name is inserted
      type: Number,
    },
    req_time: { //Date of name insert
      type: Date,
    },
  },
  {
    collection: "user",
  }
);

module.exports = mongoose.model("user", user);
