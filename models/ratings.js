// import mongoose database.
const mongoose = require("mongoose");

//make the user Schema
const ratingSchema = new mongoose.Schema(
  {
    
    from_id: { type: String },
    to_id: { type: String },
    ratings: [{
        category: { type: String },
        rating: { type: Number },
    }],
    average :{type:Number}
    
  },
  {
    timestamps: true,
  }
);

// make the User module for exporting.
const Rating = mongoose.model("rating", ratingSchema);

// export this User class created.
module.exports = Rating;
