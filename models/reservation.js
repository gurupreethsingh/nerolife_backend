// import mongoose database.
const mongoose = require("mongoose");

//make the user Schema
const reservationSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    user_email_id: { type: String },
    event_id: { type: String },
    event_name: { type: String },
    outlet_id: { type: String },
    outlet_name: { type: String },
    event_start_time: { type: Date }, // manually entry
    event_end_time: { type: Date }, // manually entry
    event_location_map: { type: String },
    event_address: { type: String, required: true }, //outlet address
    booking_guestlist: { type: Number }, //  1 to 8
    customer_category: { type: String }, //radio buttons single lady /couple /group
    poster_url: { type: String }, // Add poster_url field
  },
  {
    timestamps: true,
  }
);

// make the User module for exporting.
const Reservation = mongoose.model("reservation", reservationSchema);

// export this User class created.
module.exports = Reservation;
