// write a controller function to get all the Events from the database.
// for this first import the Event class from the models file Event.js

const Calendar = require("../models/calendar");

// function to get all the Calendars.
async function handleGetAllCalendars(req, res) {
  const allDbCalendars = await Calendar.find({});
  return res.json(allDbCalendars);
}

async function handlePostNewCalendar(req, res) {
  try {
    const body = req.body;
    console.log("body",body)

    const result = await Calendar.create({
      event_name: body.event_name,
      outlet_name: body.outlet_name,
      artist_lineup: JSON.parse(body.artist_lineup),
      event_start_time: body.event_start_time, // manually entry
      event_category: body.event_category, // dropdown
      event_address: body.event_address, //outlet address
      description: body.description,
    });
    //  we will consolel the result as well .
    console.log("Result is ", result);
    // so return the status code as 201 , so as to indicate Event has been created.
    return res
      .status(201)
      .json({ Message: "Calendar successfully created.", id: result._id });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

// function to get the Calendar by id.
async function handleGetCalendarById(req, res) {
  // first get the id enterd by the Calendar.
  const fetched_Calendar = await Calendar.findById(req.params.id);
  // if the Calendar if not found by the id.
  if (!fetched_Calendar) {
    return res.status(400).json({ error: "Calendar not found." });
  }
  // return the fetch Calendar from the database.
  return res.json(fetched_Calendar);
}

async function handleUpdateCalendarById(req, res) {
  try {
    const updatedCalendar = await Calendar.findByIdAndUpdate(
      req.params.id,
      req.body, // Use req.body to get the updated values from Postman or frontend
      { new: true, runValidators: true }
    );

    if (!updatedCalendar) {
      return res.status(404).json({ error: "Calendar not found." });
    }

    return res.json({
      status: "Calendar updated successfully.",
      updatedCalendar,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleDeleteCalendarById(req, res) {
  try {
    const deletedCalendar = await Calendar.findByIdAndDelete(req.params.id);

    if (!deletedCalendar) {
      return res.status(404).json({ error: "Calendar not found." });
    }

    const deletionTime = new Date();
    // You can perform additional operations or logging related to the deletion here.
    console.log(deletionTime);

    return res.json({
      status: "Calendar deleted successfully.",
      deletedCalendar,
      deletionTime,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleCreateNewCalendar(req, res) {
  try {
    const body = req.body;
    if (!body.event_name || !body.outlet_name || !body.event_address) {
      // we will set the reponse code to 400
      return res.status(400).json({ Warning: "All fields are required. " });
    }
    // now we will push the code into the mongodb database into the Events collection.
    const result = await Event.create({
      event_name: body.event_name,
      outlet_name: body.outlet_name,
      artist_lineup: body.artist_lineup,
      event_date: body.event_date, // manual entry
      event_start_time: body.event_start_time, // manually entry
      event_end_time: body.event_end_time, // manually entry
      booking_status: body.booking_status, //open/close matches with events start time, ends with event_start_time.
      music_category: body.music_category, // dropdown
      event_category: body.event_category, // dropdown
      event_location_map: body.event_location_map,
      event_address: body.event_address, //outlet address
      invite_link: body.invite_link,
    });
    //  we will consolel the result as well .
    console.log("Result is ", result);
    // so return the status code as 201 , so as to indicate Event has been created.
    return res
      .status(201)
      .json({ Message: "Calendar successfully created.", id: result._id });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleGetCalendarByArtistId(req, res) {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedEvent = await Calendar.find({
      "artist_lineup.id": req.params.id,
    });

    // If the event is not found by the event_id.
    if (!fetchedEvent) {
      return res.status(404).json({ error: "Event not found." });
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
  handleGetAllCalendars,
  handleGetCalendarById,
  handleUpdateCalendarById,
  handleDeleteCalendarById,
  handleCreateNewCalendar,
  handlePostNewCalendar,
  handleGetCalendarByArtistId
};
