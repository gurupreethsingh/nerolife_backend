// import mongoose database.
const mongoose = require("mongoose");


//make the user Schema
const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String },
    userId: { type: String, required: true  },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    dob: { type: Date },
    gender: { type: String },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// make the User module for exporting.
const User = mongoose.model("user", userSchema);

// export this User class created.
module.exports = User;
