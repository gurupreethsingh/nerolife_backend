// import mongoose database.
const mongoose = require("mongoose");

//make the user Schema
const documentSchema = new mongoose.Schema(
  {
    totalCustomers: { type: Number, default: 0 },
    totalArtists: { type: Number, default: 0 },
    totalEvents: { type: Number, default: 0 },
    totalOutlets: { type: Number, default: 0 },
    totalTransactions: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// make the User module for exporting.
const Documentcount = mongoose.model("documentcount", documentSchema);

// export this User class created.
module.exports = Documentcount;
