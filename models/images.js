// const mongoose=require('mongoose');

// var Images=mongoose.model('Images',{
//      id:{type:String},
//      icon:{type:String},
// });

// module.exports={Images}

// import mongoose database.
const mongoose = require("mongoose");

//make the user Schema
const imageSchema = new mongoose.Schema(
  {
    id: { type: String },
    icon: { type: String },
    image_type: { type: String },
  },
  {
    timestamps: true,
  }
);

// make the User module for exporting.
const Image = mongoose.model("image", imageSchema);

// export this User class created.
module.exports = Image;
