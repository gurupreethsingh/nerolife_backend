// write a controller function to get all the Events from the database.
// for this first import the Event class from the models file Event.js
const Reservation = require("../models/reservation");

(path = require("path")),
  (cors = require("cors")),
  (multer = require("multer"));

async function handlePostReservation(req, res, next) {
  try {
    const result = await Reservation.create({
      reservation_id: req.body.reservation_id,
      user_id: req.body.user_id,
      event_id: req.body.event_id,
      event_name: req.body.event_name,
      outlet_id: req.body.outlet_id,
      outlet_name: req.body.outlet_name,
      event_start_time: req.body.event_start_time, // manually entry
      event_end_time: req.body.event_end_time, // manually entry
      event_location_map: req.body.event_location_map,
      event_address: req.body.event_address, //outlet address
      booking_guestlist: req.body.booking_guestlist, //  1 to 8
      customer_category: req.body.customer_category, //radio buttons
      poster_url: req.body.poster_url,
    });

    return res.status(200).json({ message: "Event Reserved Successfully." });
  } catch (error) {
    return res.status(404).json({ error: "Error." });
  }
}

// function to get all the Events.
async function handleGetAllReservedEvents(req, res, next) {
  const allReservedEvents = await Reservation.find({});
  return res.json(allReservedEvents);
}

async function handleGetReservationByEventId(req, res, next) {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedEvent = await Reservation.findOne({
      event_id: req.params.event_id,
    });

    // If the event is not found by the event_id.
    if (!fetchedEvent) {
      return res.status(404).json({ error: "No Reservation." });
    }

    // Return the fetched event from the database.
    return res.json(fetchedEvent);
  } catch (error) {
    // Handle any unexpected errors.
    console.error("Error fetching event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleCheckReservation(req, res, next) {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedReserVation = await Reservation.findOne({
      user_id: req.params.user_id,
      event_id: req.params.event_id,
    });

    if (!fetchedReserVation) {
      return res.status(404).json({ error: "No Reservation." });
    }

    // Return the fetched event from the database.
    return res.status(200).json({ error: "Reserved." });
  } catch (error) {
    // Handle any unexpected errors.
    console.error("Error fetching event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetReservationByUserId(req, res, next) {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedEvent = await Reservation.find({
      user_id: req.params.user_id,
    });

    // If the event is not found by the event_id.
    if (!fetchedEvent) {
      return res.status(404).json({ error: "No Reservation." });
    }

    // Return the fetched event from the database.
    return res.json(fetchedEvent);
  } catch (error) {
    // Handle any unexpected errors.
    console.error("Error fetching event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetReservationByOutletId(req, res, next) {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedEvent = await Reservation.findOne({
      outlet_id: req.params.outlet_id,
    });

    // If the event is not found by the event_id.
    if (!fetchedEvent) {
      return res.status(404).json({ error: "No Reservation." });
    }

    // Return the fetched event from the database.
    return res.json(fetchedEvent);
  } catch (error) {
    // Handle any unexpected errors.
    console.error("Error fetching event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handlePostReservation,
  handleGetAllReservedEvents,
  handleGetReservationByEventId,
  handleGetReservationByUserId,
  handleGetReservationByOutletId,
  handleCheckReservation,
};
