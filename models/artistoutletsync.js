// import mongoose database.
const mongoose = require("mongoose");

//make the user Schema
const artistoutletsynchronizationschema = new mongoose.Schema(
  {
    artist_id: { type: String },
    outlet_id: { type: String },
    outlet_name : {type: String},
    artist_name: {type: String},
  },
  {
    timestamps: true,
  }
);


// make the User module for exporting.
const Artistoutletsynchronization = mongoose.model("artistoutletsynchronization", artistoutletsynchronizationschema);

// export this User class created.
module.exports = Artistoutletsynchronization;
