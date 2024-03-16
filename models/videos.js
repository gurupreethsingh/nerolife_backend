const mongoose = require("mongoose");

//make the user Schema
const videoSchema = new mongoose.Schema(
  {
    id: { type: String },
    video_url: { type: String },
    video_type: { type: String },
  },
  {
    timestamps: true,
  }
);

// make the User module for exporting.
const Videos = mongoose.model("video", videoSchema);

// export this User class created.
module.exports = Videos;
