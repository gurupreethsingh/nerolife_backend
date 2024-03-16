// import mongoose database.
const mongoose = require("mongoose");

//make the user Schema
const roasSchema = new mongoose.Schema(
  {
    name: { type: String },
    type: { type: String },
    link: { type: String },
    ctr: { type: Number },
    budget: { type: Number }
  },
  {
    timestamps: true,
  }
);

// make the User module for exporting.
const Roas = mongoose.model("roas", roasSchema);

// export this User class created.
module.exports = Roas;
