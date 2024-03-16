// import mongoose database.
const mongoose = require("mongoose");

//make the user Schema
const storiesSchema = new mongoose.Schema(
  {
    image_url: { type: String },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

// make the User module for exporting.
const Stories = mongoose.model("stories", storiesSchema);

// export this User class created.
module.exports = Stories;
