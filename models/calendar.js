// import mongoose database.
const mongoose = require("mongoose");

//make the user Schema
const calendarSchema = new mongoose.Schema(
  {
    event_id: { type: String },
    event_name: { type: String, required: true },
    outlet_id: { type: String },
    outlet_name: { type: String },
    artist_lineup: [
      {
        id: { type: String },
        name: { type: String },
      },
    ],
    event_start_time: { type: Date }, // manually entry
    event_end_time: { type: Date }, // manually entry
    music_category: { type: String }, // dropdown
    event_category: { type: String }, // dropdown
    reservation_category: { type: Boolean }, // if no, continue , no changes,
    event_location_map: { type: String },
    description: { type: String },
    event_address: { type: String, required: true }, //outlet address
    invite_link: { type: String },
  },
  {
    timestamps: true,
  }
);

// make the User module for exporting.
const Calendar = mongoose.model("calendar", calendarSchema);

// export this User class created.
module.exports = Calendar;
