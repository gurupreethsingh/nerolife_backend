// import mongoose database.
const mongoose = require("mongoose");

//make the user Schema
const inboxSchema = new mongoose.Schema(
  {
    message_receivers: [{
        id:{ type: String },
        email_id: { type: String },
        name: { type: String }
    }],
    subject: { type: String },
    message: { type: String },
    archieved: { type: Boolean },
    category: { type: String },
  },
  {
    timestamps: true,
  }
);

// make the User module for exporting.
const Inbox = mongoose.model("inbox", inboxSchema);

// export this User class created.
module.exports = Inbox;
