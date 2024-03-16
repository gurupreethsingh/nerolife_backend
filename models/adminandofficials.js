// import mongoose database.
const mongoose = require("mongoose");

//make the user Schema
const adminandofficialsSchema = new mongoose.Schema(
  {
    userId: { type: String },
    name: { type: String },
    type: {type: String},
    outletId : {type: String},
    role : {type : String}
  },
  {
    timestamps: true,
  }
);

// make the User module for exporting.
const AdminandOfficials = mongoose.model("adminandOfficials", adminandofficialsSchema);

// export this User class created.
module.exports = AdminandOfficials;
